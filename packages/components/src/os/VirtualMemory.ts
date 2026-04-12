import { Scene, AnimatedRect, Arrow, themes } from '@vislab/core';

export class VirtualMemory {
  private scene: Scene;
  private container: HTMLElement;
  
  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.color = themes['dark-terminal'].fg;
    wrapper.style.padding = '20px';
    wrapper.style.borderRadius = '8px';
    
    // Canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // Virtual Address Space (Process 1)
    for (let i = 0; i < 5; i++) {
        const vPage = new AnimatedRect(`vpage-${i}`, 100, 50 + (i * 45), 150, 35);
        vPage.label = `V-Page ${i}`;
        vPage.strokeColor = themes['dark-terminal'].accent1;
        this.scene.addEntity(vPage);
    }

    // Physical Memory (RAM)
    for (let i = 0; i < 8; i++) {
        const pFrame = new AnimatedRect(`pframe-${i}`, 500, 50 + (i * 45), 150, 35);
        pFrame.label = `P-Frame ${i}`;
        pFrame.strokeColor = themes['dark-terminal'].accent2;
        this.scene.addEntity(pFrame);
    }

    // Swap space
    const swap = new AnimatedRect('swap-dr', 300, 300, 150, 80);
    swap.label = 'Disk Swap';
    swap.strokeColor = themes['dark-terminal'].accent4;
    this.scene.addEntity(swap);

    // Mapping Arrows (Page Table conceptual)
    const a1 = new Arrow('map1', 250, 67, 500, 67); // v0 -> p0
    a1.color = themes['dark-terminal'].accent2;
    this.scene.addEntity(a1);

    const a2 = new Arrow('map2', 250, 112, 500, 157); // v1 -> p2
    a2.color = themes['dark-terminal'].accent2;
    this.scene.addEntity(a2);

    const a3 = new Arrow('map3', 250, 202, 300, 340); // v3 -> swap
    a3.color = themes['dark-terminal'].accent3; // Red arrow for swapped out
    a3.isAnimating = true; 
    this.scene.addEntity(a3);

    this.scene.start();
  }

  public destroy() {
    this.scene.stop();
  }
}
