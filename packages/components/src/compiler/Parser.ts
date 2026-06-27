import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class Parser {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private nodes: AnimatedRect[] = [];
  private step = 0;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Build AST step";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Parser — AST construction",
      variant: "terminal",
      canvasHeight: "300px",
      testId: "parser",
      themeName: options?.themeName,
      headerActions: stepBtn,
    });
    this.theme = t;
    styleVislabButton(stepBtn, t, "ghost");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const defs = [
      { id: "ast-rt", x: 280, y: 40, label: "Program" },
      { id: "var-decl", x: 280, y: 130, label: "VarDecl" },
      { id: "id", x: 140, y: 220, label: "Ident(x)" },
      { id: "lit", x: 420, y: 220, label: "Lit(42)" },
    ];
    for (const d of defs) {
      const r = new AnimatedRect(d.id, d.x, d.y, 120, 36);
      r.label = d.label;
      r.strokeColor = t.accent1;
      r.labelFontPx = 10;
      r.visible = false;
      this.nodes.push(r);
      this.scene.addEntity(r);
    }

    this.scene.addEntity(new Arrow("a1", 340, 76, 340, 130));
    this.scene.addEntity(new Arrow("a2", 340, 166, 200, 220));
    this.scene.addEntity(new Arrow("a3", 340, 166, 480, 220));

    this.status = new Label("ps", "let x = 42;", 12, 285);
    this.status.color = t.accent2;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    stepBtn.addEventListener("click", () => {
      if (this.step < this.nodes.length) {
        this.nodes[this.step].visible = true;
        this.nodes[this.step].fillColor = t.accent2;
        this.status.text = `Reduced: ${this.nodes[this.step].label}`;
        this.step++;
      }
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
