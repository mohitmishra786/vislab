import { AnimatedRect, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class HashCollision {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "hash-collision");
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // Hash table buckets
    for (let i = 0; i < 8; i++) {
      const bucket = new AnimatedRect(`b-${i}`, 100, 50 + i * 30, 80, 25);
      bucket.label = `[${i}]`;
      bucket.strokeColor = themes["dark-terminal"].accent4;
      this.scene.addEntity(bucket);
    }

    // Chaining items
    const i1 = new AnimatedRect("i1", 200, 50, 100, 25);
    i1.label = '"apple"';
    i1.fillColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(i1);

    const i2 = new AnimatedRect("i2", 320, 50, 100, 25);
    i2.label = '"pear" (col)';
    i2.fillColor = themes["dark-terminal"].accent3;
    this.scene.addEntity(i2);

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
  }
}
