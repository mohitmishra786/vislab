import type { Theme } from "@vislab/core";
import { AnimatedRect, QueueViz, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class ProcessScheduler {
  private scene: Scene;
  private container: HTMLElement;
  private cpuCore: AnimatedRect;
  private readyQueue: QueueViz;
  private processes: { id: string; color: string }[] = [];
  private theme: Theme;

  constructor(container: HTMLElement) {
    this.container = container;

    const spawnBtn = document.createElement("button");
    spawnBtn.type = "button";
    spawnBtn.textContent = "Spawn process";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Round-robin scheduler",
      variant: "terminal",
      canvasHeight: "300px",
      testId: "process-scheduler",
      headerActions: spawnBtn,
    });
    this.theme = t;
    styleVislabButton(spawnBtn, t, "secondary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.cpuCore = new AnimatedRect("cpu", 300, 50, 150, 100);
    this.cpuCore.label = "CPU — idle";
    this.cpuCore.strokeColor = t.accent2;
    this.cpuCore.fillColor = "transparent";
    this.cpuCore.labelColor = t.fg;
    this.cpuCore.labelFontPx = 12;
    this.scene.addEntity(this.cpuCore);

    this.readyQueue = new QueueViz("ready-q", 50, 200);
    this.readyQueue.capacity = 8;
    this.readyQueue.itemWidth = 40;
    this.readyQueue.itemHeight = 40;
    this.scene.addEntity(this.readyQueue);

    let pCount = 1;
    const palette = [t.accent1, t.accent2, t.accent3, t.accent4];
    spawnBtn.addEventListener("click", () => {
      const id = `P${pCount++}`;
      const color = palette[(pCount + 2) % palette.length];
      this.processes.push({ id, color });
      this.readyQueue.enqueue(id, color);
    });

    this.scheduleNext();
    this.scene.start();
  }

  private scheduleNext() {
    const t = this.theme;
    this.scene.scheduler.schedule({
      id: "rr-tick",
      triggerTime: this.scene.clock.simTime + 1000,
      execute: () => {
        if (this.processes.length > 0) {
          const p = this.processes.shift();
          if (p) {
            this.readyQueue.dequeue();
            this.cpuCore.fillColor = p.color;
            this.cpuCore.label = `CPU — ${p.id}`;

            setTimeout(() => {
              this.processes.push(p);
              this.readyQueue.enqueue(p.id, p.color);
            }, 800);
          }
        } else {
          this.cpuCore.fillColor = "transparent";
          this.cpuCore.label = "CPU — idle";
        }

        this.scheduleNext();
      },
    });
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
