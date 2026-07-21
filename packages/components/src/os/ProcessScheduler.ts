import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, QueueViz, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
} from "../ui/widgetRuntime";

import { type SchedulerAlgorithm, normalizeQuantum } from "./schedulerPolicy";

export type { SchedulerAlgorithm } from "./schedulerPolicy";

export type ProcessSchedulerOptions = {
  themeName?: string;
  algorithm?: SchedulerAlgorithm;
  quantum?: number;
  /** When false, scheduler loop does not start until processes are spawned. */
  autoRun?: boolean;
};

type Process = { id: string; color: string; vruntime: number };

export class ProcessScheduler {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
  private container: HTMLElement;
  private cpuCore: AnimatedRect;
  private readyQueue: QueueViz;
  private ganttBars: AnimatedRect[] = [];
  private processes: Process[] = [];
  private theme: Theme;
  private algorithm: SchedulerAlgorithm;
  private quantum: number;
  private ganttX = 50;
  private ganttY = 170;
  private tick = 0;
  private statusLabel: Label;

  constructor(container: HTMLElement, options?: ProcessSchedulerOptions) {
    this.container = container;
    this.algorithm = options?.algorithm ?? "round-robin";
    this.quantum = normalizeQuantum(options?.quantum);

    const spawnBtn = document.createElement("button");
    spawnBtn.type = "button";
    spawnBtn.textContent = "Spawn process";
    const algoBtn = document.createElement("button");
    algoBtn.type = "button";
    algoBtn.textContent = this.algorithm === "cfs" ? "CFS" : "Round-robin";

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
    } = createArticleChrome({
      title:
        this.algorithm === "cfs" ? "CFS scheduler" : "Round-robin scheduler",
      variant: "terminal",
      canvasHeight: "320px",
      testId: "process-scheduler",
      themeName: options?.themeName,
      headerActions: [algoBtn, spawnBtn, clockHost],
    });
    this.theme = t;
    styleVislabButton(spawnBtn, t, "secondary");
    styleVislabButton(algoBtn, t, "ghost");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "320px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);
    this.runtime = attachWidgetRuntime(this.scene, t, {
      wrapper,
      clockHost,
      reducedMotion,
      canvas,
      title: "VisLab widget",
      getSummary: () =>
        wrapper.querySelector("[data-vislab-summary]")?.textContent ??
        "VisLab widget",
    });

    this.cpuCore = new AnimatedRect("cpu", 300, 40, 150, 80);
    this.cpuCore.label = "CPU — idle";
    this.cpuCore.strokeColor = t.accent2;
    this.cpuCore.fillColor = "transparent";
    this.cpuCore.labelColor = t.fg;
    this.cpuCore.labelFontPx = 12;
    this.scene.addEntity(this.cpuCore);

    this.readyQueue = new QueueViz("ready-q", 50, 90);
    this.readyQueue.capacity = 8;
    this.readyQueue.itemWidth = 40;
    this.readyQueue.itemHeight = 40;
    this.scene.addEntity(this.readyQueue);

    const ganttLabel = new Label("gantt-h", "Gantt", 50, 155);
    ganttLabel.color = t.fg;
    ganttLabel.font = '10px "JetBrains Mono", monospace';
    ganttLabel.align = "left";
    this.scene.addEntity(ganttLabel);

    this.statusLabel = new Label("status", "", 50, 300);
    this.statusLabel.color = t.accent2;
    this.statusLabel.font = '10px "JetBrains Mono", monospace';
    this.statusLabel.align = "left";
    this.scene.addEntity(this.statusLabel);

    let pCount = 1;
    const palette = [t.accent1, t.accent2, t.accent3, t.accent4];
    spawnBtn.addEventListener("click", () => {
      const id = `P${pCount++}`;
      const color = palette[pCount % palette.length];
      this.processes.push({ id, color, vruntime: 0 });
      this.readyQueue.enqueue(id, color);
      this.updateStatus();
    });

    algoBtn.addEventListener("click", () => {
      this.algorithm = this.algorithm === "round-robin" ? "cfs" : "round-robin";
      algoBtn.textContent = this.algorithm === "cfs" ? "CFS" : "Round-robin";
      this.updateStatus();
    });

    if (options?.autoRun !== false) {
      this.scheduleNext();
    }
    this.scene.start();
  }

  private updateStatus() {
    const q = this.processes.length;
    this.statusLabel.text = `${this.algorithm.toUpperCase()} · quantum ${this.quantum}ms · queue: ${q}`;
  }

  private addGanttBar(color: string, width: number) {
    const bar = new AnimatedRect(
      `gantt-${this.tick}`,
      this.ganttX,
      this.ganttY,
      width,
      18,
    );
    bar.fillColor = color;
    bar.strokeColor = "transparent";
    bar.label = "";
    this.ganttBars.push(bar);
    this.scene.addEntity(bar);
    this.ganttX += width + 2;
    if (this.ganttX > 520) {
      this.ganttX = 50;
      this.ganttY += 22;
    }
  }

  private pickProcess(): Process | undefined {
    if (this.processes.length === 0) return undefined;
    if (this.algorithm === "cfs") {
      return this.processes.reduce((a, b) => (a.vruntime < b.vruntime ? a : b));
    }
    return this.processes[0];
  }

  private scheduleNext() {
    this.scene.scheduler.schedule({
      id: "sched-tick",
      triggerTime: this.scene.clock.simTime + this.quantum,
      execute: () => {
        const p = this.pickProcess();
        if (p) {
          const idx = this.processes.indexOf(p);
          if (idx >= 0) {
            this.processes.splice(idx, 1);
            this.readyQueue.dequeue();
          }
          this.cpuCore.fillColor = p.color;
          this.cpuCore.label = `CPU — ${p.id}`;
          this.addGanttBar(p.color, 36);
          p.vruntime += this.quantum;
          this.tick++;

          this.scene.scheduler.schedule({
            id: `ctx-${p.id}-${this.tick}`,
            triggerTime: this.scene.clock.simTime + 200,
            execute: () => {
              this.processes.push(p);
              this.readyQueue.enqueue(p.id, p.color);
              this.cpuCore.fillColor = "transparent";
              this.cpuCore.label = "CPU — ctx switch";
              this.updateStatus();
            },
          });
        } else {
          this.cpuCore.fillColor = "transparent";
          this.cpuCore.label = "CPU — idle";
        }
        this.updateStatus();
        this.scheduleNext();
      },
    });
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
