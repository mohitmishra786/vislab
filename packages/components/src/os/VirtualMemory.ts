import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
  createLiveSummary,
} from "../ui/widgetRuntime";

export type VirtualMemoryOptions = {
  themeName?: string;
  pageCount?: number;
};

export class VirtualMemory {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
  private container: HTMLElement;
  private theme: Theme;
  private pageCount: number;
  private vPages: AnimatedRect[] = [];
  private pFrames: AnimatedRect[] = [];
  private pointer: AnimatedRect;
  private status: Label;
  private step = 0;

  constructor(container: HTMLElement, options?: VirtualMemoryOptions) {
    this.container = container;
    this.pageCount = Math.min(12, Math.max(4, options?.pageCount ?? 6));

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Page walk";
    const faultBtn = document.createElement("button");
    faultBtn.type = "button";
    faultBtn.textContent = "Page fault";

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
      setSummary,
    } = createArticleChrome({
      title: "Virtual memory — page table walk",
      variant: "terminal",
      canvasHeight: "360px",
      testId: "virtual-memory",
      themeName: options?.themeName,
      headerActions: [stepBtn, faultBtn, clockHost],
    });
    this.theme = t;
    styleVislabButton(stepBtn, t, "primary");
    styleVislabButton(faultBtn, t, "danger");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "360px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);
    const liveSummary = createLiveSummary(
      setSummary,
      "Virtual-to-physical page mapping. Page walk animates a translation; Page fault marks an unmapped page.",
    );
    this.runtime = attachWidgetRuntime(this.scene, t, {
      wrapper,
      clockHost,
      reducedMotion,
      canvas,
      title: "Virtual memory — page table walk",
      summary: liveSummary,
    });

    const ptLabel = new Label("pt", "Page Table", 280, 28);
    ptLabel.color = t.accent2;
    ptLabel.font = '11px "JetBrains Mono", monospace';
    this.scene.addEntity(ptLabel);

    for (let i = 0; i < this.pageCount; i++) {
      const v = new AnimatedRect(`vp-${i}`, 40, 50 + i * 38, 120, 32);
      v.label = `v${i}`;
      v.strokeColor = t.accent1;
      v.labelFontPx = 11;
      v.labelColor = t.fg;
      this.vPages.push(v);
      this.scene.addEntity(v);

      const p = new AnimatedRect(`pp-${i}`, 480, 50 + i * 38, 120, 32);
      p.label = `frame ${i}`;
      p.strokeColor = t.accent2;
      p.labelFontPx = 11;
      p.labelColor = t.fg;
      this.pFrames.push(p);
      this.scene.addEntity(p);
    }

    const swap = new AnimatedRect("swap", 280, 300, 140, 40);
    swap.label = "Swap (disk)";
    swap.strokeColor = t.accent3;
    swap.labelFontPx = 11;
    this.scene.addEntity(swap);

    this.pointer = new AnimatedRect("ptr", 36, 50, 8, 32);
    this.pointer.fillColor = t.accent4;
    this.pointer.strokeColor = "transparent";
    this.pointer.label = "";
    this.scene.addEntity(this.pointer);

    this.status = new Label("st", "TLB miss → walk page table", 40, 340);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    stepBtn.addEventListener("click", () => this.walkPage());
    faultBtn.addEventListener("click", () => this.pageFault());

    this.scene.start();
  }

  private walkPage() {
    const t = this.theme;
    const idx = this.step % this.pageCount;
    const v = this.vPages[idx];
    const p = this.pFrames[idx];
    this.pointer.moveTo(36, v.y, 0.15);
    v.fillColor = t.accent1;
    this.status.text = `Walking v${idx} → PTE → frame ${idx}`;
    this.runtime?.summary.set(
      `Virtual memory: walking virtual page v${idx} through the page table to physical frame ${idx}.`,
    );

    this.scene.scheduler.schedule({
      id: `map-${idx}`,
      triggerTime: this.scene.clock.simTime + 500,
      execute: () => {
        p.fillColor = t.accent2;
        const arrow = new Arrow(
          `a-${idx}-${this.scene.clock.simTime}`,
          160,
          v.y + 16,
          480,
          p.y + 16,
        );
        arrow.color = t.accent2;
        this.scene.addEntity(arrow);
        this.scene.scheduler.schedule({
          id: `clr-${idx}`,
          triggerTime: this.scene.clock.simTime + 600,
          execute: () => {
            v.fillColor = "transparent";
            p.fillColor = "transparent";
            this.scene.removeEntity(arrow.id);
          },
        });
        this.step++;
      },
    });
  }

  private pageFault() {
    const t = this.theme;
    const idx = Math.floor(Math.random() * this.pageCount);
    const v = this.vPages[idx];
    v.fillColor = t.accent3;
    this.status.text = `Page fault on v${idx} — swap in from disk`;
    this.runtime?.summary.set(
      `Virtual memory: page fault on v${idx} — OS will swap the page in from disk and update the PTE.`,
    );
    this.scene.scheduler.schedule({
      id: "fault-swap",
      triggerTime: this.scene.clock.simTime + 800,
      execute: () => {
        this.pFrames[idx].fillColor = t.accent3;
        v.fillColor = "transparent";
        this.status.text = `v${idx} mapped after disk read`;
      },
    });
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
