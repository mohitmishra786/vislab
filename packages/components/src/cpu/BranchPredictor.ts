import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import type { VislabWidgetOptions } from "../types";

export class BranchPredictor {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private stateLabel: Label;
  private stateMachine: AnimatedRect[] = [];
  private counter = 0;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const takenBtn = document.createElement("button");
    takenBtn.type = "button";
    takenBtn.textContent = "Branch taken";
    const notTakenBtn = document.createElement("button");
    notTakenBtn.type = "button";
    notTakenBtn.textContent = "Not taken";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "2-bit saturating branch predictor",
      variant: "diagram",
      canvasHeight: "220px",
      testId: "branch-predictor",
      themeName: options?.themeName,
      headerActions: [takenBtn, notTakenBtn],
    });
    this.theme = t;
    styleVislabButton(takenBtn, t, "primary");
    styleVislabButton(notTakenBtn, t, "secondary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "220px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.stateLabel = new Label("state-lbl", "Prediction: Not Taken", 280, 24);
    this.stateLabel.font = '12px "JetBrains Mono", monospace';
    this.stateLabel.color = t.fg;
    this.scene.addEntity(this.stateLabel);

    const states = [
      "Strongly NT",
      "Weakly NT",
      "Weakly T",
      "Strongly T",
    ];
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`st-${i}`, 30 + i * 130, 70, 110, 50);
      rect.label = states[i];
      rect.strokeColor = t.accent4;
      rect.labelFontPx = 10;
      this.stateMachine.push(rect);
      this.scene.addEntity(rect);
    }
    this.updateHighlight();

    takenBtn.addEventListener("click", () => this.evaluate(true));
    notTakenBtn.addEventListener("click", () => this.evaluate(false));
    this.scene.start();
  }

  private evaluate(actuallyTaken: boolean) {
    if (actuallyTaken) {
      this.counter = Math.min(3, this.counter + 1);
    } else {
      this.counter = Math.max(0, this.counter - 1);
    }
    this.updateHighlight();
  }

  private updateHighlight() {
    const t = this.theme;
    for (let i = 0; i < 4; i++) {
      this.stateMachine[i].fillColor =
        i === this.counter ? t.accent1 : "transparent";
    }
    this.stateLabel.text =
      this.counter >= 2 ? "Prediction: Taken" : "Prediction: Not Taken";
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}