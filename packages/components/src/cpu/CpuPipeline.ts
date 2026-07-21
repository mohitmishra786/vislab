import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { createSimClockControls } from "../ui/simClockControls";
import { styleVislabButton } from "../ui/vislabButtons";
import { detectDataHazard } from "./pipelineHazards";

const DEFAULT_STAGES = ["IF", "ID", "EX", "MEM", "WB"];

export type CpuPipelineOptions = {
  stages?: string[];
  themeName?: string;
  autoPlay?: boolean;
};

type Instruction = {
  id: string;
  bubble: AnimatedRect;
  stageIndex: number;
  label: string;
};

export class CpuPipeline {
  private scene: Scene;
  private container: HTMLElement;
  private stages: string[];
  private stageRects: AnimatedRect[] = [];
  private stageCenters: { x: number; y: number }[] = [];
  private instructions: Instruction[] = [];
  private nextInstNum = 1;
  private stallLabel: Label | null = null;
  private running = false;
  private clockControls: ReturnType<typeof createSimClockControls> | null =
    null;

  constructor(container: HTMLElement, options?: CpuPipelineOptions) {
    this.container = container;
    this.stages =
      options?.stages && options.stages.length > 0
        ? options.stages
        : DEFAULT_STAGES;

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Step";
    const clockHost = document.createElement("div");

    const {
      wrapper,
      prepareCanvas,
      theme: t,
      setSummary,
      reducedMotion,
    } = createArticleChrome({
      title: "CPU pipeline",
      variant: "diagram",
      canvasHeight: "200px",
      testId: "cpu-pipeline",
      themeName: options?.themeName,
      headerActions: [clockHost, stepBtn],
      summary: `Instruction pipeline stages: ${this.stages.join(" → ")}.`,
      minWidth: "280px",
    });

    styleVislabButton(stepBtn, t, "secondary");
    stepBtn.setAttribute("aria-label", "Advance one pipeline cycle");

    const canvas = prepareCanvas({ height: "200px" });

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const stageWidth = 64;
    const stageHeight = 44;
    const gap = 20;
    let startX = 12;
    const y = 28;

    for (let i = 0; i < this.stages.length; i++) {
      const rect = new AnimatedRect(
        `stage-${i}`,
        startX,
        y,
        stageWidth,
        stageHeight,
      );
      rect.label = this.stages[i];
      rect.strokeColor = t.accent1;
      rect.fillColor = t.surface;
      rect.labelColor = t.fg;
      rect.labelFontPx = 12;
      this.stageRects.push(rect);
      this.stageCenters.push({
        x: startX + stageWidth / 2,
        y: y + stageHeight / 2,
      });
      this.scene.addEntity(rect);
      startX += stageWidth + gap;
    }

    startX = 12;
    for (let i = 0; i < this.stages.length - 1; i++) {
      const arrow = new Arrow(
        `arrow-${i}`,
        startX + stageWidth,
        y + stageHeight / 2,
        startX + stageWidth + gap,
        y + stageHeight / 2,
      );
      arrow.isAnimating = true;
      arrow.color = t.fg;
      this.scene.addEntity(arrow);
      startX += stageWidth + gap;
    }

    this.stallLabel = new Label("stall", "", 12, y + stageHeight + 18);
    this.stallLabel.color = t.accent3;
    this.stallLabel.font = '11px "JetBrains Mono", monospace';
    this.scene.addEntity(this.stallLabel);

    const wantAuto = options?.autoPlay !== false && !reducedMotion;

    this.clockControls = createSimClockControls(this.scene, t, {
      keyboardRoot: wrapper,
      startPaused: !wantAuto,
      onPauseChange: (paused) => {
        this.running = !paused;
        if (!paused) {
          this.scheduleFetch();
          this.scheduleAdvance();
        }
      },
    });
    clockHost.appendChild(this.clockControls.root);

    stepBtn.addEventListener("click", () => {
      this.scene.clock.pause();
      this.running = false;
      this.clockControls?.refresh();
      this.advancePipeline();
    });

    this.scene.start();
    if (wantAuto) {
      this.running = true;
      this.scene.clock.speed = 1.5;
      this.scheduleFetch();
      this.scheduleAdvance();
    }
    setSummary(
      `CPU pipeline visualization with stages ${this.stages.join(", ")}. Use Pause/Play and speed controls; Step advances one cycle.`,
    );
  }

  private scheduleAdvance() {
    this.scene.scheduler.schedule({
      id: `advance-${this.scene.clock.simTime}`,
      triggerTime: this.scene.clock.simTime + 900,
      execute: () => {
        if (this.running) {
          this.advancePipeline();
          this.scheduleAdvance();
        }
      },
    });
  }

  private scheduleFetch() {
    this.scene.scheduler.schedule({
      id: `fetch-${this.nextInstNum}`,
      triggerTime: this.scene.clock.simTime + 1200,
      execute: () => {
        this.fetchInstruction();
        if (this.running) this.scheduleFetch();
      },
    });
  }

  private fetchInstruction() {
    const id = `inst-${this.nextInstNum++}`;
    const label = `I${this.nextInstNum - 1}`;
    const center = this.stageCenters[0];
    const bubble = new AnimatedRect(id, center.x - 14, center.y - 10, 28, 20);
    bubble.label = label;
    bubble.fillColor = "#3b82f6";
    bubble.strokeColor = "#60a5fa";
    bubble.labelColor = "#fff";
    bubble.labelFontPx = 10;
    this.scene.addEntity(bubble);
    this.instructions.push({ id, bubble, stageIndex: 0, label });
    this.checkHazard();
  }

  private checkHazard() {
    const result = detectDataHazard(
      this.stages,
      this.instructions.map((i) => ({
        id: i.id,
        stageIndex: i.stageIndex,
        label: i.label,
      })),
    );
    if (result.kind !== "data" || result.stallStageIndex === null) {
      if (this.stallLabel) this.stallLabel.text = "";
      return;
    }

    const exIdx = result.stallStageIndex;
    if (this.stallLabel) {
      this.stallLabel.text = result.message;
    }
    const stall = new AnimatedRect(
      `stall-${Date.now()}`,
      this.stageCenters[exIdx].x - 10,
      this.stageCenters[exIdx].y - 8,
      20,
      16,
    );
    stall.label = "⊘";
    stall.fillColor = "#ef4444";
    stall.strokeColor = "#f87171";
    stall.labelColor = "#fff";
    stall.labelFontPx = 12;
    this.scene.addEntity(stall);
    this.scene.scheduler.schedule({
      id: `remove-stall-${stall.id}`,
      triggerTime: this.scene.clock.simTime + 800,
      execute: () => this.scene.removeEntity(stall.id),
    });
  }

  private advancePipeline() {
    const completed: string[] = [];
    for (const inst of this.instructions) {
      if (inst.stageIndex >= this.stages.length - 1) {
        completed.push(inst.id);
        continue;
      }
      inst.stageIndex++;
      const center = this.stageCenters[inst.stageIndex];
      inst.bubble.moveTo(center.x - 14, center.y - 10, 0.12);
    }
    for (const id of completed) {
      this.scene.removeEntity(id);
      this.instructions = this.instructions.filter((i) => i.id !== id);
    }
    this.checkHazard();
  }

  public destroy() {
    this.clockControls?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
