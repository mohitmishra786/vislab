import { Scene, AnimatedRect, QueueViz, themes } from '@vislab/core';

export class ProcessScheduler {
  private scene: Scene;
  private container: HTMLElement;
  private cpuCore: AnimatedRect;
  private readyQueue: QueueViz;

  private processes: { id: string; color: string }[] = [];
  private currentProcessIndex: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    
    const wrapper = document.createElement('div');
    wrapper.style.fontFamily = themes['dark-terminal'].font;
    wrapper.style.backgroundColor = themes['dark-terminal'].bg;
    wrapper.style.color = themes['dark-terminal'].fg;
    wrapper.style.padding = '20px';
    wrapper.style.borderRadius = '8px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '15px';
    
    // Controls
    const controls = document.createElement('div');
    const spawnBtn = document.createElement('button');
    spawnBtn.textContent = 'Spawn Process';
    spawnBtn.style.padding = '8px 16px';
    spawnBtn.style.cursor = 'pointer';
    spawnBtn.style.backgroundColor = themes['dark-terminal'].accent1;
    spawnBtn.style.border = 'none';
    
    controls.appendChild(spawnBtn);
    wrapper.appendChild(controls);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '300px';
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    this.cpuCore = new AnimatedRect('cpu', 300, 50, 150, 100);
    this.cpuCore.label = 'CPU Current Process: None';
    this.cpuCore.strokeColor = themes['dark-terminal'].accent2;
    this.scene.addEntity(this.cpuCore);

    this.readyQueue = new QueueViz('ready-q', 50, 200);
    this.readyQueue.capacity = 8;
    this.readyQueue.itemWidth = 40;
    this.readyQueue.itemHeight = 40;
    this.scene.addEntity(this.readyQueue);

    let pCount = 1;
    spawnBtn.addEventListener('click', () => {
        const id = `P${pCount++}`;
        const color = Object.values(themes['dark-terminal']).filter(c => c.startsWith('#') && c !== themes['dark-terminal'].bg)[pCount % 4];
        this.processes.push({ id, color });
        this.readyQueue.enqueue(id, color);
    });

    // Simple Round Robin Scheduler Loop
    this.scheduleNext();

    this.scene.start();
  }

  private scheduleNext() {
      this.scene.scheduler.schedule({
          id: 'rr-tick',
          triggerTime: this.scene.clock.simTime + 1000,
          execute: () => {
              if (this.processes.length > 0) {
                  const p = this.processes.shift();
                  if (p) {
                      this.readyQueue.dequeue();
                      this.cpuCore.fillColor = p.color;
                      this.cpuCore.label = `CPU (Exec ${p.id})`;

                      setTimeout(() => {
                           // Context switch out
                           this.processes.push(p);
                           this.readyQueue.enqueue(p.id, p.color);
                      }, 800);
                  }
              } else {
                  this.cpuCore.fillColor = 'transparent';
                  this.cpuCore.label = 'CPU (IDLE)';
              }

              this.scheduleNext();
          }
      });
  }

  public destroy() {
    this.scene.stop();
    this.container.innerHTML = '';
  }
}
