import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class RegisterAllocator {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private regs: AnimatedRect[] = [];
  private spill: AnimatedRect;
  private vars = ["a", "b", "c", "d", "e"];
  private varIdx = 0;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const allocBtn = document.createElement("button");
    allocBtn.type = "button";
    allocBtn.textContent = "Allocate var";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Register allocation",
      variant: "toolbar",
      canvasHeight: "200px",
      testId: "register-allocator",
      themeName: options?.themeName,
      headerActions: allocBtn,
    });
    this.theme = t;
    styleVislabButton(allocBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "200px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`r${i}`, 50 + i * 100, 70, 80, 40);
      rect.label = `R${i}`;
      rect.strokeColor = t.accent2;
      rect.labelFontPx = 12;
      this.regs.push(rect);
      this.scene.addEntity(rect);
    }

    this.spill = new AnimatedRect("stack", 480, 70, 90, 80);
    this.spill.label = "Stack";
    this.spill.strokeColor = t.accent3;
    this.spill.labelFontPx = 11;
    this.scene.addEntity(this.spill);

    this.status = new Label("ra", "4 registers available", 12, 175);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    allocBtn.addEventListener("click", () => this.allocate());

    this.scene.start();
  }

  private allocate() {
    if (this.varIdx >= this.vars.length) return;
    const v = this.vars[this.varIdx++];
    const t = this.theme;
    if (this.varIdx <= 4) {
      const reg = this.regs[this.varIdx - 1];
      reg.fillColor = t.accent1;
      reg.label = `R${this.varIdx - 1}=${v}`;
      this.status.text = `Assigned ${v} → R${this.varIdx - 1}`;
    } else {
      this.spill.fillColor = t.accent3;
      this.status.text = `Spill ${v} to stack (registers full)`;
      this.scene.scheduler.schedule({
        id: "spill-clr",
        triggerTime: this.scene.clock.simTime + 500,
        execute: () => {
          this.spill.fillColor = "transparent";
        },
      });
    }
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
