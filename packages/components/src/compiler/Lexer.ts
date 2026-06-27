import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class Lexer {
  private scene: Scene;
  private container: HTMLElement;
  private sourceLabel: Label;
  private pointer: AnimatedRect;
  private tokens: AnimatedRect[] = [];
  private sourceText = "let x = 42;";
  private currentIndex = 0;
  private theme: Theme;

  constructor(container: HTMLElement) {
    this.container = container;

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Step";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Lexer trace",
      variant: "terminal",
      canvasHeight: "220px",
      testId: "lexer",
      headerActions: stepBtn,
    });
    this.theme = t;
    styleVislabButton(stepBtn, t, "ghost");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "220px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.sourceLabel = new Label("src", this.sourceText, 50, 52);
    this.sourceLabel.align = "left";
    this.sourceLabel.font = '20px "JetBrains Mono", "Courier New", monospace';
    this.sourceLabel.color = t.fg;
    this.scene.addEntity(this.sourceLabel);

    this.pointer = new AnimatedRect("ptr", 50, 78, 14, 4);
    this.pointer.fillColor = t.accent3;
    this.scene.addEntity(this.pointer);

    stepBtn.addEventListener("click", () => this.step());
    this.scene.start();
  }

  private step() {
    if (this.currentIndex >= this.sourceText.length) return;
    const t = this.theme;

    const charWidth = 12.2;
    this.currentIndex++;
    this.pointer.x = 50 + this.currentIndex * charWidth;

    if (
      this.currentIndex === 3 ||
      this.currentIndex === 5 ||
      this.currentIndex === 7 ||
      this.currentIndex === 10
    ) {
      const tRect = new AnimatedRect(
        `t-${this.currentIndex}`,
        50 + this.tokens.length * 80,
        118,
        64,
        26,
      );
      tRect.label = "tok";
      tRect.strokeColor = t.accent2;
      tRect.fillColor = t.surface;
      tRect.labelColor = t.fg;
      tRect.labelFontPx = 11;
      this.tokens.push(tRect);
      this.scene.addEntity(tRect);
    }
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
