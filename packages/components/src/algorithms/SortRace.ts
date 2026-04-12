import { Scene, AnimatedRect, themes } from '@vislab/core';

export class SortRace {
  private scene: Scene;
  private container: HTMLElement;
  private isSorting = false;

  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.padding = '20px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '15px';

    const controls = document.createElement('div');
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Sort Race (Bubble vs Insertion)';
    startBtn.style.padding = '8px';
    startBtn.style.backgroundColor = themes['dark-terminal'].accent1;
    controls.appendChild(startBtn);
    wrapper.appendChild(controls);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '300px';
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);
    
    // Bubble sort array
    const bubbleArr = this.createArrayVisual(50, 50, [8, 3, 5, 1, 9, 2, 7, 4, 6]);
    // Insertion sort array
    const insertArr = this.createArrayVisual(50, 150, [8, 3, 5, 1, 9, 2, 7, 4, 6]);

    startBtn.addEventListener('click', () => {
        if (this.isSorting) return;
        this.isSorting = true;
        this.runBubbleSort(bubbleArr);
        this.runInsertionSort(insertArr);
    });

    this.scene.start();
  }

  private createArrayVisual(startX: number, y: number, data: number[]): { rects: AnimatedRect[], vals: number[] } {
      const rects: AnimatedRect[] = [];
      for (let i = 0; i < data.length; i++) {
          const size = data[i] * 5 + 10;
          const r = new AnimatedRect(`arr-${y}-${i}`, startX + (i * 35), y + (50 - size), 30, size);
          r.label = data[i].toString();
          r.fillColor = themes['dark-terminal'].accent4;
          rects.push(r);
          this.scene.addEntity(r);
      }
      return { rects, vals: [...data] };
  }

  private runBubbleSort(arr: { rects: AnimatedRect[], vals: number[] }) {
      let i = 0, j = 0;
      const n = arr.vals.length;
      
      const step = () => {
          if (i >= n - 1) return; // Done
          
          if (j >= n - i - 1) {
              arr.rects[j].fillColor = themes['dark-terminal'].accent2; // Locked
              i++;
              j = 0;
              this.scene.scheduler.schedule({ id: `bs-${i}-${j}`, triggerTime: this.scene.clock.simTime + 50, execute: step });
              return;
          }

          if (arr.vals[j] > arr.vals[j + 1]) {
              // Swap
              const temp = arr.vals[j];
              arr.vals[j] = arr.vals[j + 1];
              arr.vals[j+1] = temp;

              // Swap visual positions
              const r1 = arr.rects[j];
              const r2 = arr.rects[j + 1];
              const tx = r1.x;
              r1.moveTo(r2.x, r1.y);
              r2.moveTo(tx, r2.y);
              
              arr.rects[j] = r2;
              arr.rects[j+1] = r1;
          }

          j++;
          this.scene.scheduler.schedule({ id: `bs-${i}-${j}`, triggerTime: this.scene.clock.simTime + 100, execute: step });
      };

      step();
  }

  private runInsertionSort(arr: { rects: AnimatedRect[], vals: number[] }) {
      // Very basic simulation timer logic for insertion
      let i = 1;

      const step = () => {
          if (i >= arr.vals.length) {
              arr.rects.forEach(r => r.fillColor = themes['dark-terminal'].accent2);
              return; // Done
          }
          let key = arr.vals[i];
          let keyRect = arr.rects[i];
          let j = i - 1;
          
          while (j >= 0 && arr.vals[j] > key) {
              arr.vals[j + 1] = arr.vals[j];
              
              const r1 = arr.rects[j + 1];
              const r2 = arr.rects[j];
              r2.moveTo(r1.x, r2.y);
              arr.rects[j+1] = r2;
              j--;
          }
          arr.vals[j + 1] = key;
          keyRect.moveTo(50 + ((j+1) * 35), keyRect.y);
          arr.rects[j+1] = keyRect;
          
          i++;
          this.scene.scheduler.schedule({ id: `is-${i}`, triggerTime: this.scene.clock.simTime + 200, execute: step });
      }

      step();
  }

  public destroy() { this.scene.stop(); }
}
