import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import type { VislabWidgetOptions } from "../types";

export class SyscallTrace {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private traceArrow: Arrow;
  private kernelSpace: AnimatedRect;
  private userSpace: AnimatedRect;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const syscallBtn = document.createElement("button");
    syscallBtn.type = "button";
    syscallBtn.textContent = "write() syscall";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Syscall trace — user → kernel",
      variant: "terminal",
      canvasHeight: "340px",
      testId: "syscall-trace",
      themeName: options?.themeName,
      headerActions: syscallBtn,
    });
    this.theme = t;
    styleVislabButton(syscallBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "340px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.userSpace = new AnimatedRect("uspace", 40, 40, 520, 90);
    this.userSpace.label = "User space (Ring 3)";
    this.userSpace.strokeColor = "#555";
    this.userSpace.labelFontPx = 11;
    this.scene.addEntity(this.userSpace);

    this.kernelSpace = new AnimatedRect("kspace", 40, 170, 520, 140);
    this.kernelSpace.label = "Kernel (Ring 0)";
    this.kernelSpace.strokeColor = t.accent3;
    this.kernelSpace.labelFontPx = 11;
    this.scene.addEntity(this.kernelSpace);

    const app = new AnimatedRect("app", 80, 70, 90, 40);
    app.label = "App";
    app.fillColor = t.accent1;
    app.labelFontPx = 11;
    this.scene.addEntity(app);

    const vfs = new AnimatedRect("vfs", 80, 190, 120, 36);
    vfs.label = "VFS";
    vfs.strokeColor = t.accent2;
    vfs.labelFontPx = 10;
    this.scene.addEntity(vfs);

    const block = new AnimatedRect("block", 260, 230, 120, 36);
    block.label = "Block layer";
    block.strokeColor = t.accent2;
    block.labelFontPx = 10;
    this.scene.addEntity(block);

    const driver = new AnimatedRect("driver", 420, 260, 110, 36);
    driver.label = "Driver";
    driver.strokeColor = t.accent2;
    driver.labelFontPx = 10;
    this.scene.addEntity(driver);

    this.traceArrow = new Arrow("trace", 125, 110, 140, 190);
    this.traceArrow.visible = false;
    this.traceArrow.color = t.accent1;
    this.scene.addEntity(this.traceArrow);

    this.status = new Label("sc", "Idle", 40, 325);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    syscallBtn.addEventListener("click", () => this.runTrace());

    this.scene.start();
  }

  private runTrace() {
    const t = this.theme;
    this.traceArrow.visible = true;
    this.kernelSpace.fillColor = "#1a1010";
    this.status.text = "syscall → VFS";

    this.scene.scheduler.schedule({
      id: "vfs",
      triggerTime: this.scene.clock.simTime + 600,
      execute: () => {
        this.traceArrow.startX = 200;
        this.traceArrow.startY = 208;
        this.traceArrow.endX = 320;
        this.traceArrow.endY = 248;
        this.status.text = "VFS → block layer";
      },
    });
    this.scene.scheduler.schedule({
      id: "drv",
      triggerTime: this.scene.clock.simTime + 1200,
      execute: () => {
        this.traceArrow.startX = 380;
        this.traceArrow.startY = 248;
        this.traceArrow.endX = 475;
        this.traceArrow.endY = 278;
        this.status.text = "Block → device driver";
      },
    });
    this.scene.scheduler.schedule({
      id: "done",
      triggerTime: this.scene.clock.simTime + 2000,
      execute: () => {
        this.traceArrow.visible = false;
        this.kernelSpace.fillColor = "transparent";
        this.status.text = "Return to user space";
      },
    });
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}