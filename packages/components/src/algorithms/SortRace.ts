import type { Theme } from "@vislab/core";
import { AnimatedRect, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
} from "../ui/widgetRuntime";

export type SortRaceOptions = {
  themeName?: string;
  arraySize?: number;
  /** Fixed seed for deterministic bar layout (visual tests, docs). */
  seed?: number;
};

function seededShuffle(size: number, seed: number): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class SortRace {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
  private container: HTMLElement;
  private isSorting = false;
  private theme: Theme;
  private arraySize = 9;

  constructor(container: HTMLElement, options?: SortRaceOptions) {
    this.container = container;
    this.arraySize = Math.min(20, Math.max(6, options?.arraySize ?? 9));

    const startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.textContent = "Run race";

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
      setSummary,
    } = createArticleChrome({
      title: "Sort race — bubble vs insertion vs quick",
      variant: "toolbar",
      canvasHeight: "300px",
      testId: "sort-race",
      themeName: options?.themeName,
      headerActions: [startBtn, clockHost],
    });
    this.theme = t;
    styleVislabButton(startBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "300px";
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
      title: "Sort race — bubble vs insertion vs quick",
      getSummary: () =>
        wrapper.querySelector("[data-vislab-summary]")?.textContent ??
        "Sort race — bubble vs insertion vs quick",
    });

    const data =
      options?.seed !== undefined
        ? seededShuffle(this.arraySize, options.seed)
        : Array.from({ length: this.arraySize }, (_, i) => i + 1).sort(
            () => Math.random() - 0.5,
          );
    const bubbleArr = this.createArrayVisual(50, 50, data);
    const insertArr = this.createArrayVisual(50, 130, data);
    const quickArr = this.createArrayVisual(50, 210, data);

    startBtn.addEventListener("click", () => {
      if (this.isSorting) return;
      this.isSorting = true;
      this.runBubbleSort(bubbleArr);
      this.runInsertionSort(insertArr);
      this.runQuickSort(quickArr);
    });

    this.scene.start();
  }

  private createArrayVisual(
    startX: number,
    y: number,
    data: number[],
  ): { rects: AnimatedRect[]; vals: number[] } {
    const t = this.theme;
    const rects: AnimatedRect[] = [];
    for (let i = 0; i < data.length; i++) {
      const size = data[i] * 5 + 10;
      const r = new AnimatedRect(
        `arr-${y}-${i}`,
        startX + i * 35,
        y + (50 - size),
        30,
        size,
      );
      r.label = data[i].toString();
      r.fillColor = t.accent4;
      r.labelColor = t.bg;
      r.labelFontPx = 12;
      rects.push(r);
      this.scene.addEntity(r);
    }
    return { rects, vals: [...data] };
  }

  private runBubbleSort(arr: { rects: AnimatedRect[]; vals: number[] }) {
    const t = this.theme;
    let i = 0;
    let j = 0;
    const n = arr.vals.length;

    const step = () => {
      if (i >= n - 1) return;

      if (j >= n - i - 1) {
        arr.rects[j].fillColor = t.accent2;
        i++;
        j = 0;
        this.scene.scheduler.schedule({
          id: `bs-${i}-${j}`,
          triggerTime: this.scene.clock.simTime + 50,
          execute: step,
        });
        return;
      }

      if (arr.vals[j] > arr.vals[j + 1]) {
        const temp = arr.vals[j];
        arr.vals[j] = arr.vals[j + 1];
        arr.vals[j + 1] = temp;

        const r1 = arr.rects[j];
        const r2 = arr.rects[j + 1];
        const tx = r1.x;
        r1.moveTo(r2.x, r1.y);
        r2.moveTo(tx, r2.y);

        arr.rects[j] = r2;
        arr.rects[j + 1] = r1;
      }

      j++;
      this.scene.scheduler.schedule({
        id: `bs-${i}-${j}`,
        triggerTime: this.scene.clock.simTime + 100,
        execute: step,
      });
    };

    step();
  }

  private runInsertionSort(arr: { rects: AnimatedRect[]; vals: number[] }) {
    const t = this.theme;
    let i = 1;

    const step = () => {
      if (i >= arr.vals.length) {
        for (const r of arr.rects) {
          r.fillColor = t.accent2;
        }
        return;
      }
      const key = arr.vals[i];
      const keyRect = arr.rects[i];
      let j = i - 1;

      while (j >= 0 && arr.vals[j] > key) {
        arr.vals[j + 1] = arr.vals[j];

        const r1 = arr.rects[j + 1];
        const r2 = arr.rects[j];
        r2.moveTo(r1.x, r2.y);
        arr.rects[j + 1] = r2;
        j--;
      }
      arr.vals[j + 1] = key;
      const baseX = arr.rects[0]?.x ?? 50;
      const stepX = 35;
      keyRect.moveTo(baseX + (j + 1) * stepX, keyRect.y);
      arr.rects[j + 1] = keyRect;

      i++;
      this.scene.scheduler.schedule({
        id: `is-${i}`,
        triggerTime: this.scene.clock.simTime + 200,
        execute: step,
      });
    };

    step();
  }

  /** Simplified quicksort visualization (faster step interval). */
  private runQuickSort(arr: { rects: AnimatedRect[]; vals: number[] }) {
    const t = this.theme;
    const schedule = (fn: () => void, delay = 60) => {
      this.scene.scheduler.schedule({
        id: `qs-${this.scene.clock.simTime}`,
        triggerTime: this.scene.clock.simTime + delay,
        execute: fn,
      });
    };

    const partition = (low: number, high: number, done: () => void) => {
      if (low >= high) {
        schedule(done, 40);
        return;
      }
      const pivot = arr.vals[high];
      let i = low;
      let j = low;
      const stepJ = () => {
        if (j >= high) {
          const tmp = arr.vals[i];
          arr.vals[i] = arr.vals[high];
          arr.vals[high] = tmp;
          schedule(
            () => partition(low, i - 1, () => partition(i + 1, high, done)),
            40,
          );
          return;
        }
        if (arr.vals[j] < pivot) {
          const tmp = arr.vals[i];
          arr.vals[i] = arr.vals[j];
          arr.vals[j] = tmp;
          const r1 = arr.rects[i];
          const r2 = arr.rects[j];
          const tx = r1.x;
          r1.moveTo(r2.x, r1.y, 0.2);
          r2.moveTo(tx, r2.y, 0.2);
          arr.rects[i] = r2;
          arr.rects[j] = r1;
          i++;
        }
        j++;
        schedule(stepJ, 50);
      };
      stepJ();
    };

    partition(0, arr.vals.length - 1, () => {
      for (const r of arr.rects) r.fillColor = t.accent2;
    });
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
