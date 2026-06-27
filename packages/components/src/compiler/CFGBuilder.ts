import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class CFGBuilder {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private blocks: AnimatedRect[] = [];
  private step = 0;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Trace path";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Control-flow graph",
      variant: "diagram",
      canvasHeight: "300px",
      testId: "cfg-builder",
      themeName: options?.themeName,
      headerActions: stepBtn,
    });
    this.theme = t;
    styleVislabButton(stepBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const defs = [
      { id: "bb0", x: 280, y: 40, label: "BB0 Entry" },
      { id: "bb1", x: 140, y: 130, label: "BB1 True" },
      { id: "bb2", x: 420, y: 130, label: "BB2 False" },
      { id: "bb3", x: 280, y: 220, label: "BB3 Join" },
    ];
    for (const d of defs) {
      const b = new AnimatedRect(d.id, d.x, d.y, 100, 36);
      b.label = d.label;
      b.strokeColor = t.accent1;
      b.labelFontPx = 10;
      this.blocks.push(b);
      this.scene.addEntity(b);
    }

    this.scene.addEntity(new Arrow("e1", 330, 76, 190, 130));
    this.scene.addEntity(new Arrow("e2", 330, 76, 470, 130));
    this.scene.addEntity(new Arrow("e3", 190, 166, 330, 220));
    this.scene.addEntity(new Arrow("e4", 470, 166, 330, 220));

    this.status = new Label("cfg", "if (x) … else …", 12, 285);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    const path = [0, 1, 3];
    stepBtn.addEventListener("click", () => {
      if (this.step >= path.length) {
        this.step = 0;
        for (const b of this.blocks) b.fillColor = "transparent";
      }
      const idx = path[this.step++];
      this.blocks[idx].fillColor = t.accent2;
      this.status.text = `Executing ${this.blocks[idx].label}`;
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
