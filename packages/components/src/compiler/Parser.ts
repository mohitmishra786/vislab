import { AnimatedRect, Arrow, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class Parser {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "parser");
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    const root = new AnimatedRect("ast-rt", 300, 50, 120, 40);
    root.label = "Program";
    root.strokeColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(root);

    const varDecl = new AnimatedRect("var-decl", 300, 150, 140, 40);
    varDecl.label = "VariableDecl";
    varDecl.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(varDecl);

    const id = new AnimatedRect("id", 150, 250, 100, 40);
    id.label = "Ident(x)";
    this.scene.addEntity(id);

    const lit = new AnimatedRect("lit", 450, 250, 100, 40);
    lit.label = "Lit(42)";
    this.scene.addEntity(lit);

    this.scene.addEntity(new Arrow("a1", 360, 90, 360, 150));
    this.scene.addEntity(new Arrow("a2", 360, 190, 200, 250));
    this.scene.addEntity(new Arrow("a3", 360, 190, 500, 250));

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
  }
}
