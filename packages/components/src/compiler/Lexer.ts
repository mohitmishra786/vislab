import { Scene, AnimatedRect, Label, themes } from '@vislab/core';

export class Lexer {
  private scene: Scene;
  private container: HTMLElement;
  private sourceLabel: Label;
  private pointer: AnimatedRect;
  private tokens: AnimatedRect[] = [];
  
  private sourceText = "let x = 42;";
  private currentIndex = 0;
  
  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.padding = '20px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '15px';
    
    // UI controls
    const controls = document.createElement('div');
    const stepBtn = document.createElement('button');
    stepBtn.textContent = 'Step Lexer';
    controls.appendChild(stepBtn);
    wrapper.appendChild(controls);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '200px';
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);
    
    this.sourceLabel = new Label('src', this.sourceText, 50, 50);
    this.sourceLabel.align = 'left';
    this.sourceLabel.font = '24px monospace';
    this.scene.addEntity(this.sourceLabel);

    this.pointer = new AnimatedRect('ptr', 50, 70, 15, 5);
    this.pointer.fillColor = themes['dark-terminal'].accent3;
    this.scene.addEntity(this.pointer);

    stepBtn.addEventListener('click', () => this.step());
    this.scene.start();
  }

  private step() {
      if (this.currentIndex >= this.sourceText.length) return;
      
      const charWidth = 14.5; // roughly for 24px monospace
      this.currentIndex++;
      this.pointer.x = 50 + (this.currentIndex * charWidth);

      // Super naive token push visual
      if (this.currentIndex === 3 || this.currentIndex === 5 || this.currentIndex === 7 || this.currentIndex === 10) {
          const tRect = new AnimatedRect(`t-${this.currentIndex}`, 50 + (this.tokens.length * 80), 120, 70, 30);
          tRect.label = 'Token';
          tRect.strokeColor = themes['dark-terminal'].accent2;
          this.tokens.push(tRect);
          this.scene.addEntity(tRect);
      }
  }

  public destroy() { this.scene.stop(); }
}
