import { AnimatedRect, Arrow, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";

const DEFAULT_STAGES = ["IF", "ID", "EX", "MEM", "WB"];

export class CpuPipeline {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, stageNames?: string[]) {
    this.container = container;

    const stages =
      stageNames && stageNames.length > 0 ? stageNames : DEFAULT_STAGES;

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "CPU pipeline",
      variant: "diagram",
      canvasHeight: "156px",
    });

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "156px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const stageWidth = 64;
    const stageHeight = 44;
    const gap = 20;
    let startX = 12;
    const y = 22;

    for (let i = 0; i < stages.length; i++) {
      const rect = new AnimatedRect(
        `stage-${i}`,
        startX,
        y,
        stageWidth,
        stageHeight,
      );
      rect.label = stages[i];
      rect.strokeColor = t.accent1;
      rect.fillColor = t.surface;
      rect.labelColor = t.fg;
      rect.labelFontPx = 12;
      this.scene.addEntity(rect);
      startX += stageWidth + gap;
    }

    startX = 12;
    for (let i = 0; i < stages.length - 1; i++) {
      const arrow = new Arrow(
        `arrow-${i}`,
        startX + stageWidth,
        y + stageHeight / 2,
        startX + stageWidth + gap,
        y + stageHeight / 2,
      );
      arrow.isAnimating = true;
      arrow.color = t.fg;
      this.scene.addEntity(arrow);
      startX += stageWidth + gap;
    }

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
