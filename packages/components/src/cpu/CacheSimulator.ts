import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
} from "../ui/widgetRuntime";
import { type CachePolicy, pickVictimIndex, touchOnHit } from "./cachePolicy";

export type { CachePolicy } from "./cachePolicy";

export type CacheSimulatorOptions = {
  themeName?: string;
  policy?: CachePolicy;
  lineCount?: number;
};

type CacheLine = {
  rect: AnimatedRect;
  tag: string | null;
  /** Set when line is filled — FIFO order. */
  insertedAt: number;
  /** Recency for LRU (and set on fill). */
  lastUsed: number;
};

export class CacheSimulator {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
  private container: HTMLElement;
  private l1: CacheLine[] = [];
  private l2: CacheLine[] = [];
  private l3: CacheLine[] = [];
  private memoryBlocks: AnimatedRect[] = [];
  private theme: Theme;
  private policy: CachePolicy;
  private lineCount: number;
  private hits = 0;
  private misses = 0;
  private accessCounter = 0;
  private statsLabel: Label;

  constructor(container: HTMLElement, options?: CacheSimulatorOptions) {
    this.container = container;
    this.policy = options?.policy === "fifo" ? "fifo" : "lru";
    this.lineCount = Math.min(16, Math.max(4, options?.lineCount ?? 8));

    const requestBtn = document.createElement("button");
    requestBtn.type = "button";
    requestBtn.textContent = "Random access";
    const policyBtn = document.createElement("button");
    policyBtn.type = "button";
    policyBtn.textContent = `Policy: ${this.policy.toUpperCase()}`;

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
    } = createArticleChrome({
      title: "Cache hierarchy",
      variant: "toolbar",
      canvasHeight: "400px",
      testId: "cache-simulator",
      themeName: options?.themeName,
      headerActions: [policyBtn, requestBtn, clockHost],
    });
    this.theme = t;
    styleVislabButton(requestBtn, t, "primary");
    styleVislabButton(policyBtn, t, "secondary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.minWidth = "720px";
    canvas.style.height = "400px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);
    this.runtime = attachWidgetRuntime(this.scene, t, {
      wrapper,
      clockHost,
      reducedMotion,
      canvas,
      title: "Cache hierarchy",
      getSummary: () =>
        wrapper.querySelector("[data-vislab-summary]")?.textContent ??
        "Cache hierarchy",
    });

    this.layoutArchitecture();
    this.statsLabel = new Label("stats", "Hit rate: —", 12, 380);
    this.statsLabel.color = t.fg;
    this.statsLabel.font = '11px "JetBrains Mono", monospace';
    this.statsLabel.align = "left";
    this.scene.addEntity(this.statsLabel);

    requestBtn.addEventListener("click", () => {
      this.simulateMemoryAccess(Math.floor(Math.random() * this.lineCount));
    });

    policyBtn.addEventListener("click", () => {
      this.policy = this.policy === "lru" ? "fifo" : "lru";
      policyBtn.textContent = `Policy: ${this.policy.toUpperCase()}`;
    });

    this.scene.start();
  }

  private layoutArchitecture() {
    const t = this.theme;
    const l1y = 40;
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`l1-${i}`, 40, l1y + i * 42, 100, 36);
      rect.label = "L1 ∅";
      rect.strokeColor = t.accent2;
      rect.labelFontPx = 10;
      rect.labelColor = t.fg;
      const line: CacheLine = { rect, tag: null, insertedAt: 0, lastUsed: 0 };
      this.l1.push(line);
      this.scene.addEntity(rect);
    }

    for (let i = 0; i < 6; i++) {
      const rect = new AnimatedRect(`l2-${i}`, 200, l1y + i * 38, 110, 32);
      rect.label = "L2 ∅";
      rect.strokeColor = t.accent1;
      rect.labelFontPx = 10;
      rect.labelColor = t.fg;
      const line: CacheLine = { rect, tag: null, insertedAt: 0, lastUsed: 0 };
      this.l2.push(line);
      this.scene.addEntity(rect);
    }

    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`l3-${i}`, 360, l1y + i * 42, 120, 36);
      rect.label = "L3 ∅";
      rect.strokeColor = t.accent4;
      rect.labelFontPx = 10;
      rect.labelColor = t.fg;
      const line: CacheLine = { rect, tag: null, insertedAt: 0, lastUsed: 0 };
      this.l3.push(line);
      this.scene.addEntity(rect);
    }

    for (let i = 0; i < this.lineCount; i++) {
      const tag = `0x0${i}A`;
      const rect = new AnimatedRect(`mem-${i}`, 530, l1y + i * 36, 140, 30);
      rect.label = tag;
      rect.strokeColor = t.accent4;
      rect.labelFontPx = 10;
      rect.labelColor = t.fg;
      this.memoryBlocks.push(rect);
      this.scene.addEntity(rect);
    }
  }

  private tagFor(index: number) {
    return `0x0${index}A`;
  }

  private flash(rect: AnimatedRect, color: string, ms = 500) {
    rect.fillColor = color;
    this.scene.scheduler.schedule({
      id: `flash-${rect.id}-${this.scene.clock.simTime}`,
      triggerTime: this.scene.clock.simTime + ms,
      execute: () => {
        rect.fillColor = "transparent";
      },
    });
  }

  private pickVictim(lines: CacheLine[]): CacheLine {
    const idx = pickVictimIndex(lines, this.policy);
    return lines[idx];
  }

  private fillLine(line: CacheLine, tag: string, counter: number) {
    line.tag = tag;
    line.insertedAt = counter;
    line.lastUsed = counter;
  }

  private updateStats() {
    const total = this.hits + this.misses;
    const rate = total > 0 ? ((this.hits / total) * 100).toFixed(0) : "—";
    this.statsLabel.text = `Hit rate: ${rate}% (${this.hits}H / ${this.misses}M) · ${this.policy.toUpperCase()}`;
  }

  private simulateMemoryAccess(addressIndex: number) {
    const t = this.theme;
    const tag = this.tagFor(addressIndex);
    this.accessCounter++;

    const l1Hit = this.l1.find((l) => l.tag === tag);
    if (l1Hit) {
      this.hits++;
      if (touchOnHit(this.policy)) {
        l1Hit.lastUsed = this.accessCounter;
      }
      l1Hit.rect.label = `L1 ${tag}`;
      this.flash(l1Hit.rect, t.accent2);
      this.updateStats();
      return;
    }

    this.misses++;
    const l2Hit = this.l2.find((l) => l.tag === tag);
    if (l2Hit) {
      if (touchOnHit(this.policy)) {
        l2Hit.lastUsed = this.accessCounter;
      }
      this.flash(l2Hit.rect, t.accent3, 400);
      const victim = this.pickVictim(this.l1);
      this.fillLine(victim, tag, this.accessCounter);
      victim.rect.label = `L1 ${tag}`;
      this.updateStats();
      return;
    }

    const l3Hit = this.l3.find((l) => l.tag === tag);
    if (l3Hit) {
      if (touchOnHit(this.policy)) {
        l3Hit.lastUsed = this.accessCounter;
      }
      this.flash(l3Hit.rect, t.accent3, 400);
      const l2Victim = this.pickVictim(this.l2);
      this.fillLine(l2Victim, tag, this.accessCounter);
      l2Victim.rect.label = `L2 ${tag}`;
      const l1Victim = this.pickVictim(this.l1);
      this.fillLine(l1Victim, tag, this.accessCounter);
      l1Victim.rect.label = `L1 ${tag}`;
      this.updateStats();
      return;
    }

    this.memoryBlocks[addressIndex].fillColor = t.accent3;
    this.scene.scheduler.schedule({
      id: `mem-fetch-${addressIndex}`,
      triggerTime: this.scene.clock.simTime + 600,
      execute: () => {
        this.memoryBlocks[addressIndex].fillColor = "transparent";
        const l3Victim = this.pickVictim(this.l3);
        this.fillLine(l3Victim, tag, this.accessCounter);
        l3Victim.rect.label = `L3 ${tag}`;
        const l2Victim = this.pickVictim(this.l2);
        this.fillLine(l2Victim, tag, this.accessCounter);
        l2Victim.rect.label = `L2 ${tag}`;
        const l1Victim = this.pickVictim(this.l1);
        this.fillLine(l1Victim, tag, this.accessCounter);
        l1Victim.rect.label = `L1 ${tag}`;
        this.updateStats();
      },
    });
    this.updateStats();
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
