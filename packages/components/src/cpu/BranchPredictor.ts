import { AnimatedRect, Label, Scene, themes } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";

export class BranchPredictor {
  private scene: Scene;
  private container: HTMLElement;
  private stateLabel: Label;
  private stateMachine: AnimatedRect[] = [];

  // 2-bit saturating counter logic:
  // 0: Strongly Not Taken, 1: Weakly Not Taken, 2: Weakly Taken, 3: Strongly Taken
  private counter = 0;

  constructor(container: HTMLElement, _options?: VislabWidgetOptions) {
    this.container = container;

    // UI Wrapper
    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = themes["dark-terminal"].font;
    wrapper.style.backgroundColor = themes["dark-terminal"].bg;
    wrapper.style.color = themes["dark-terminal"].fg;
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "15px";

    // Controls
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "10px";

    const trueBtn = document.createElement("button");
    trueBtn.textContent = "Branch Evaluated: Taken";
    trueBtn.style.padding = "8px 16px";
    trueBtn.style.cursor = "pointer";
    trueBtn.style.backgroundColor = themes["dark-terminal"].accent2;
    trueBtn.style.border = "none";

    const falseBtn = document.createElement("button");
    falseBtn.textContent = "Branch Evaluated: Not Taken";
    falseBtn.style.padding = "8px 16px";
    falseBtn.style.cursor = "pointer";
    falseBtn.style.backgroundColor = themes["dark-terminal"].accent3;
    falseBtn.style.border = "none";

    controls.appendChild(trueBtn);
    controls.appendChild(falseBtn);
    wrapper.appendChild(controls);

    // Canvas
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "250px";
    wrapper.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    // Render logic
    this.stateLabel = new Label("state-lbl", "Prediction: Not Taken", 300, 30);
    this.stateLabel.font = "20px monospace";
    this.stateLabel.color = themes["dark-terminal"].fg;
    this.scene.addEntity(this.stateLabel);

    this.layoutStates();
    this.updateHighlight();

    trueBtn.addEventListener("click", () => this.evaluate(true));
    falseBtn.addEventListener("click", () => this.evaluate(false));

    this.scene.start();
  }

  private layoutStates() {
    const states = [
      "Strongly NG",
      "Weakly NG",
      "Weakly Taken",
      "Strongly Taken",
    ];
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`st-${i}`, 50 + i * 150, 100, 120, 60);
      rect.label = states[i];
      rect.strokeColor = themes["dark-terminal"].accent4;
      this.stateMachine.push(rect);
      this.scene.addEntity(rect);
    }
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
    for (let i = 0; i < 4; i++) {
      this.stateMachine[i].fillColor =
        i === this.counter ? themes["dark-terminal"].accent1 : "transparent";
    }

    if (this.counter >= 2) {
      this.stateLabel.text = "Prediction: Taken";
    } else {
      this.stateLabel.text = "Prediction: Not Taken";
    }
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
