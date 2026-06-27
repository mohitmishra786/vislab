import { AnimatedRect, Arrow, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class SyscallTrace {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "syscall-trace");
    wrapper.style.fontFamily = themes["dark-terminal"].font;
    wrapper.style.backgroundColor = themes["dark-terminal"].bg;
    wrapper.style.color = themes["dark-terminal"].fg;
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "8px";

    // Controls
    const controls = document.createElement("div");
    const syscallBtn = document.createElement("button");
    syscallBtn.textContent = "Trigger write() syscall";
    syscallBtn.style.padding = "8px 16px";
    syscallBtn.style.cursor = "pointer";
    syscallBtn.style.backgroundColor = themes["dark-terminal"].accent1;
    syscallBtn.style.border = "none";

    controls.appendChild(syscallBtn);
    wrapper.appendChild(controls);

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "350px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // User Space vs Kernel Space delineation
    const userSpace = new AnimatedRect("uspace", 50, 50, 600, 100);
    userSpace.label = "User Space";
    userSpace.strokeColor = "#555";
    this.scene.addEntity(userSpace);

    const kernelSpace = new AnimatedRect("kspace", 50, 200, 600, 150);
    kernelSpace.label = "Kernel Space (Ring 0)";
    kernelSpace.strokeColor = themes["dark-terminal"].accent3;
    this.scene.addEntity(kernelSpace);

    const app = new AnimatedRect("app", 100, 75, 100, 50);
    app.label = "App.c";
    app.fillColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(app);

    const vfs = new AnimatedRect("vfs", 100, 220, 150, 40);
    vfs.label = "VFS";
    vfs.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(vfs);

    const blockLayer = new AnimatedRect("block", 300, 260, 150, 40);
    blockLayer.label = "Block Layer";
    blockLayer.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(blockLayer);

    const deviceDriver = new AnimatedRect("driver", 500, 300, 120, 40);
    deviceDriver.label = "Device Driver";
    deviceDriver.strokeColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(deviceDriver);

    const traceArrow = new Arrow("trace", 150, 125, 175, 220);
    traceArrow.visible = false;
    this.scene.addEntity(traceArrow);

    syscallBtn.addEventListener("click", () => {
      traceArrow.visible = true;
      traceArrow.isAnimating = true;

      // Context switch visual
      userSpace.strokeColor = "#333";
      kernelSpace.strokeColor = themes["dark-terminal"].accent3;
      kernelSpace.fillColor = "#2a1a1a";

      setTimeout(() => {
        traceArrow.startX = 250;
        traceArrow.startY = 240;
        traceArrow.endX = 300;
        traceArrow.endY = 280;
      }, 1000);

      setTimeout(() => {
        traceArrow.startX = 450;
        traceArrow.startY = 280;
        traceArrow.endX = 500;
        traceArrow.endY = 320;
      }, 2000);

      setTimeout(() => {
        traceArrow.visible = false;
        kernelSpace.fillColor = "transparent";
      }, 3000);
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
