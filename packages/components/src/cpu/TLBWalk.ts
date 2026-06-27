import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import type { VislabWidgetOptions } from "../types";

export class TLBWalk {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private tlb: AnimatedRect;
  private pageTable: AnimatedRect[] = [];
  private status: Label;
  private hits = 0;
  private misses = 0;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const hitBtn = document.createElement("button");
    hitBtn.type = "button";
    hitBtn.textContent = "TLB hit";
    const missBtn = document.createElement("button");
    missBtn.type = "button";
    missBtn.textContent = "TLB miss (walk)";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "TLB / page walk",
      variant: "toolbar",
      canvasHeight: "320px",
      testId: "tlb-walk",
      themeName: options?.themeName,
      headerActions: [hitBtn, missBtn],
    });
    this.theme = t;
    styleVislabButton(hitBtn, t, "primary");
    styleVislabButton(missBtn, t, "secondary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "320px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.tlb = new AnimatedRect("tlb", 40, 120, 100, 70);
    this.tlb.label = "TLB";
    this.tlb.strokeColor = t.accent1;
    this.tlb.labelFontPx = 11;
    this.scene.addEntity(this.tlb);

    const levels = ["PGD", "PUD", "PMD", "PTE"];
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(
        `pt-${i}`,
        200 + i * 110,
        80 + i * 40,
        90,
        44,
      );
      rect.label = levels[i];
      rect.strokeColor = t.accent4;
      rect.labelFontPx = 10;
      this.pageTable.push(rect);
      this.scene.addEntity(rect);
      if (i > 0) {
        const prev = this.pageTable[i - 1];
        const arrow = new Arrow(
          `arr-${i}`,
          prev.x + prev.width,
          prev.y + prev.height / 2,
          rect.x,
          rect.y + rect.height / 2,
        );
        arrow.color = t.fg;
        this.scene.addEntity(arrow);
      }
    }

    const phys = new AnimatedRect("phys", 620, 200, 100, 50);
    phys.label = "Physical";
    phys.strokeColor = t.accent2;
    phys.labelFontPx = 11;
    this.scene.addEntity(phys);

    this.status = new Label("tlb-st", "Hit rate: —", 40, 300);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    hitBtn.addEventListener("click", () => this.simulateHit());
    missBtn.addEventListener("click", () => this.simulateMiss());

    this.scene.start();
  }

  private updateStats(msg: string) {
    const total = this.hits + this.misses;
    const rate = total ? ((this.hits / total) * 100).toFixed(0) : "—";
    this.status.text = `${msg} · hit ${rate}% (${this.hits}H/${this.misses}M)`;
  }

  private simulateHit() {
    const t = this.theme;
    this.hits++;
    this.tlb.fillColor = t.accent2;
    this.tlb.label = "TLB HIT (~1ns)";
    this.updateStats("Fast path");
    this.scene.scheduler.schedule({
      id: "hit-clr",
      triggerTime: this.scene.clock.simTime + 500,
      execute: () => {
        this.tlb.fillColor = "transparent";
        this.tlb.label = "TLB";
      },
    });
  }

  private simulateMiss() {
    const t = this.theme;
    this.misses++;
    this.tlb.fillColor = t.accent3;
    this.tlb.label = "TLB MISS";
    this.updateStats("Page walk…");
    let level = 0;
    const walk = () => {
      if (level > 0) this.pageTable[level - 1].fillColor = "transparent";
      if (level < 4) {
        this.pageTable[level].fillColor = t.accent1;
        level++;
        this.scene.scheduler.schedule({
          id: `walk-${level}`,
          triggerTime: this.scene.clock.simTime + 350,
          execute: walk,
        });
      } else {
        this.tlb.fillColor = t.accent2;
        this.tlb.label = "Cached in TLB";
        this.updateStats("Walk complete (~100ns)");
        this.scene.scheduler.schedule({
          id: "miss-done",
          triggerTime: this.scene.clock.simTime + 500,
          execute: () => {
            this.tlb.fillColor = "transparent";
            this.tlb.label = "TLB";
            for (const p of this.pageTable) p.fillColor = "transparent";
          },
        });
      }
    };
    walk();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}