import type { Theme } from "@vislab/core";
import { AnimatedRect, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class SortRace {
  private scene: Scene;
  private container: HTMLElement;
  private isSorting = false;
  private theme: Theme;

  constructor(container: HTMLElement) {
    this.container = container;

    const startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.textContent = "Run race";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Sort race — bubble vs insertion",
      variant: "toolbar",
      canvasHeight: "300px",
      testId: "sort-race",
      headerActions: startBtn,
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

    const bubbleArr = this.createArrayVisual(
      50,
      50,
      [8, 3, 5, 1, 9, 2, 7, 4, 6],
    );
    const insertArr = this.createArrayVisual(
      50,
      150,
      [8, 3, 5, 1, 9, 2, 7, 4, 6],
    );

    startBtn.addEventListener("click", () => {
      if (this.isSorting) return;
      this.isSorting = true;
      this.runBubbleSort(bubbleArr);
      this.runInsertionSort(insertArr);
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

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
