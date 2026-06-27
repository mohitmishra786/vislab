import { AnimatedRect, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class BTreeOps {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "btree-ops");
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // Root node
    const root = new AnimatedRect("r", 300, 50, 100, 40);
    root.label = "[ 40 | 80 ]";
    root.strokeColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(root);

    // Children
    const c1 = new AnimatedRect("c1", 100, 150, 120, 40);
    c1.label = "[ 10 | 20 | 30 ]";
    c1.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(c1);

    const c2 = new AnimatedRect("c2", 300, 150, 100, 40);
    c2.label = "[ 50 | 60 ]";
    c2.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(c2);

    const c3 = new AnimatedRect("c3", 500, 150, 120, 40);
    c3.label = "[ 90 | 100 | 110 ]";
    c3.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(c3);

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
  }
}
