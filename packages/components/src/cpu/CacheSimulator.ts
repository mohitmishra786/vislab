import { Scene, AnimatedRect, themes } from '@vislab/core';

export class CacheSimulator {
  private scene: Scene;
  private container: HTMLElement;
  private memoryBlocks: AnimatedRect[] = [];
  private l1Cache: AnimatedRect[] = [];
  private l2Cache: AnimatedRect[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    
    // UI Wrapper
    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.color = themes['dark-terminal'].fg;
    wrapper.style.padding = '20px';
    wrapper.style.borderRadius = '8px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '10px';
    
    // Controls
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '15px';
    
    const requestBtn = document.createElement('button');
    requestBtn.textContent = 'Request Random Memory';
    requestBtn.style.padding = '8px 16px';
    requestBtn.style.cursor = 'pointer';
    requestBtn.style.backgroundColor = themes['dark-terminal'].accent1;
    requestBtn.style.border = 'none';
    requestBtn.style.borderRadius = '4px';

    controls.appendChild(requestBtn);
    wrapper.appendChild(controls);

    // Canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    wrapper.appendChild(canvas);
    
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.layoutArchitecture();

    requestBtn.addEventListener('click', () => {
      this.simulateMemoryAccess(Math.floor(Math.random() * 8));
    });

    this.scene.start();
  }

  private layoutArchitecture() {
    // Generate L1 (4 blocks)
    for (let i = 0; i < 4; i++) {
        const rect = new AnimatedRect(`l1-${i}`, 150, 50 + (i * 45), 100, 35);
        rect.label = `L1 [Empty]`;
        rect.strokeColor = themes['dark-terminal'].accent2;
        this.l1Cache.push(rect);
        this.scene.addEntity(rect);
    }
    
    // Generate L2 (8 blocks)
    for (let i = 0; i < 8; i++) {
        const rect = new AnimatedRect(`l2-${i}`, 350, 50 + (i * 40), 120, 30);
        rect.label = `L2 [Empty]`;
        rect.strokeColor = themes['dark-terminal'].accent1;
        this.l2Cache.push(rect);
        this.scene.addEntity(rect);
    }

    // Generate Main Memory (8 visible blocks representing pages/chunks)
    for (let i = 0; i < 8; i++) {
        const rect = new AnimatedRect(`mem-${i}`, 600, 50 + (i * 40), 150, 30);
        rect.label = `Add: 0x0${i}A`;
        rect.strokeColor = themes['dark-terminal'].accent4;
        this.memoryBlocks.push(rect);
        this.scene.addEntity(rect);
    }
  }

  private simulateMemoryAccess(addressIndex: number) {
     // Extremely simplified L1/L2 routing logic
     const l1Index = addressIndex % 4; // Direct mapped for simplicity
     const l2Index = addressIndex; // Full fit

     const l1Block = this.l1Cache[l1Index];
     
     // Check L1 Hit
     if (l1Block.label === `L1 [0x0${addressIndex}A]`) {
        l1Block.fillColor = themes['dark-terminal'].accent2; // Green flash
        setTimeout(() => { l1Block.fillColor = 'transparent'; }, 500);
        return;
     }

     // L1 Miss, check L2 Hit
     l1Block.fillColor = themes['dark-terminal'].accent3; // Red flash (Miss)
     const l2Block = this.l2Cache[l2Index];

     setTimeout(() => {
        if (l2Block.label === `L2 [0x0${addressIndex}A]`) {
             l2Block.fillColor = themes['dark-terminal'].accent2; // Green flash L2 Hit
             setTimeout(() => { l2Block.fillColor = 'transparent'; }, 500);
        } else {
             l2Block.fillColor = themes['dark-terminal'].accent3; // Red flash L2 Miss
             // Fetch from memory
             this.memoryBlocks[addressIndex].fillColor = themes['dark-terminal'].accent2;
             setTimeout(() => { this.memoryBlocks[addressIndex].fillColor = 'transparent'; }, 500);
             
             // Update caches
             l2Block.label = `L2 [0x0${addressIndex}A]`;
        }

        // Write to L1
        l1Block.label = `L1 [0x0${addressIndex}A]`;
        l1Block.fillColor = 'transparent';
     }, 600);
  }
  
  public destroy() {
    this.scene.stop();
    this.container.innerHTML = '';
  }
}
