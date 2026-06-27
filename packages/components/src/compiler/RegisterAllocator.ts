import { AnimatedRect, Scene, themes } from "@vislab/core";

export class RegisterAllocator {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "200px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    const regCount = 4;
    for (let i = 0; i < regCount; i++) {
      const rect = new AnimatedRect(`r${i}`, 50 + i * 100, 80, 80, 40);
      rect.label = `R${i}`;
      rect.strokeColor = themes["dark-terminal"].accent2;
      this.scene.addEntity(rect);
    }

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
  }
}
