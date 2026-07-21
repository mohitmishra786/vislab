import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
  createLiveSummary,
} from "../ui/widgetRuntime";

export class BranchPredictor {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
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

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
      setSummary,
    } = createArticleChrome({
      title: "2-bit saturating branch predictor",
      variant: "diagram",
      canvasHeight: "220px",
      testId: "branch-predictor",
      themeName: options?.themeName,
      headerActions: [takenBtn, notTakenBtn, clockHost],
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
    const liveSummary = createLiveSummary(
      setSummary,
      "2-bit saturating counter branch predictor. Branch taken / Not taken steps the state machine between Strongly NT and Strongly T.",
    );
    this.runtime = attachWidgetRuntime(this.scene, t, {
      wrapper,
      clockHost,
      reducedMotion,
      canvas,
      title: "2-bit saturating branch predictor",
      summary: liveSummary,
      showStaticExport: false,
    });

    this.stateLabel = new Label("state-lbl", "Prediction: Not Taken", 280, 24);
    this.stateLabel.font = '12px "JetBrains Mono", monospace';
    this.stateLabel.color = t.fg;
    this.scene.addEntity(this.stateLabel);

    const states = ["Strongly NT", "Weakly NT", "Weakly T", "Strongly T"];
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
    const states = ["Strongly NT", "Weakly NT", "Weakly T", "Strongly T"];
    for (let i = 0; i < 4; i++) {
      this.stateMachine[i].fillColor =
        i === this.counter ? t.accent1 : "transparent";
    }
    const prediction =
      this.counter >= 2 ? "Prediction: Taken" : "Prediction: Not Taken";
    this.stateLabel.text = prediction;
    this.runtime?.summary.set(
      `2-bit branch predictor: state ${states[this.counter]} (${this.counter}/3). ${prediction}.`,
    );
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
