import { AnimatedRect, Arrow, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class CFGBuilder {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "cfg-builder");
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    const bb1 = new AnimatedRect("bb1", 300, 50, 100, 40);
    bb1.label = "BB0 (Entry)";
    bb1.strokeColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(bb1);

    const bb2 = new AnimatedRect("bb2", 150, 150, 100, 40);
    bb2.label = "BB1 (If True)";
    this.scene.addEntity(bb2);

    const bb3 = new AnimatedRect("bb3", 450, 150, 100, 40);
    bb3.label = "BB2 (If False)";
    this.scene.addEntity(bb3);

    const bb4 = new AnimatedRect("bb4", 300, 250, 100, 40);
    bb4.label = "BB3 (Join)";
    this.scene.addEntity(bb4);

    this.scene.addEntity(new Arrow("a1", 350, 90, 200, 150));
    this.scene.addEntity(new Arrow("a2", 350, 90, 500, 150));
    this.scene.addEntity(new Arrow("a3", 200, 190, 350, 250));
    this.scene.addEntity(new Arrow("a4", 500, 190, 350, 250));

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
  }
}
