import { Scene, AnimatedRect, Arrow, themes, Entity } from '@vislab/core';

export class CpuPipeline {
  private scene: Scene;
  private container: HTMLElement;
  private stages: AnimatedRect[] = [];
  
  constructor(container: HTMLElement, stageNames: string[] = ['IF', 'ID', 'EX', 'MEM', 'WB']) {
    this.container = container;
    
    // UI Wrapper
    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.color = themes['dark-terminal'].fg;
    wrapper.style.padding = '20px';
    wrapper.style.borderRadius = '8px';
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '200px';
    wrapper.appendChild(canvas);
    
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    // Setup pipeline stages
    const stageWidth = 80;
    const stageHeight = 60;
    const gap = 40;
    let startX = 50;
    const y = 50;

    for (let i = 0; i < stageNames.length; i++) {
      const rect = new AnimatedRect(`stage-${i}`, startX, y, stageWidth, stageHeight);
      rect.label = stageNames[i];
      rect.strokeColor = themes['dark-terminal'].accent1;
      this.stages.push(rect);
      this.scene.addEntity(rect);

      // Draw arrow to next stage
      if (i < stageNames.length - 1) {
        const arrow = new Arrow(`arrow-${i}`, startX + stageWidth, y + stageHeight / 2, startX + stageWidth + gap, y + stageHeight / 2);
        arrow.isAnimating = true;
        this.scene.addEntity(arrow);
      }

      startX += stageWidth + gap;
    }

    this.scene.start();
  }

  public destroy() {
    this.scene.stop();
    this.container.innerHTML = '';
  }
}
