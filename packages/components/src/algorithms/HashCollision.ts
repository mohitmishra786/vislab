import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import {
  type WidgetRuntime,
  attachWidgetRuntime,
  createClockHost,
} from "../ui/widgetRuntime";

export class HashCollision {
  private scene: Scene;
  private runtime: WidgetRuntime | null = null;
  private container: HTMLElement;
  private theme: Theme;
  private buckets: AnimatedRect[] = [];
  private keys = ["apple", "banana", "cherry", "date"];
  private keyIdx = 0;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const insertBtn = document.createElement("button");
    insertBtn.type = "button";
    insertBtn.textContent = "Insert next";

    const clockHost = createClockHost();

    const {
      wrapper,
      canvasMount,
      theme: t,
      reducedMotion,
    } = createArticleChrome({
      title: "Hash table — chaining",
      variant: "toolbar",
      canvasHeight: "300px",
      testId: "hash-collision",
      themeName: options?.themeName,
      headerActions: [insertBtn, clockHost],
    });
    this.theme = t;
    styleVislabButton(insertBtn, t, "primary");

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
      title: "Hash table — chaining",
      getSummary: () =>
        wrapper.querySelector("[data-vislab-summary]")?.textContent ??
        "Hash table — chaining",
    });

    for (let i = 0; i < 8; i++) {
      const bucket = new AnimatedRect(`b-${i}`, 60, 40 + i * 30, 70, 24);
      bucket.label = `[${i}]`;
      bucket.strokeColor = t.accent4;
      bucket.labelFontPx = 10;
      this.buckets.push(bucket);
      this.scene.addEntity(bucket);
    }

    this.status = new Label("hs", "Separate chaining on collision", 60, 285);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    insertBtn.addEventListener("click", () => this.insertNext());

    this.scene.start();
  }

  private hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 31) % 8;
    return h;
  }

  private insertNext() {
    if (this.keyIdx >= this.keys.length) {
      this.status.text = "All keys inserted";
      return;
    }
    const key = this.keys[this.keyIdx++];
    const bucket = this.hash(key);
    const chainX = 150 + (this.keyIdx % 3) * 90;
    const item = new AnimatedRect(`k-${key}`, 140, 20, 80, 22);
    item.label = key;
    item.fillColor = this.theme.accent1;
    item.labelFontPx = 10;
    item.labelColor = this.theme.bg;
    this.scene.addEntity(item);
    item.moveTo(chainX, this.buckets[bucket].y, 0.12);
    this.buckets[bucket].fillColor = this.theme.accent3;
    this.status.text = `"${key}" → bucket [${bucket}]${this.keyIdx > 2 ? " (collision)" : ""}`;
    this.scene.scheduler.schedule({
      id: `clr-b-${bucket}`,
      triggerTime: this.scene.clock.simTime + 400,
      execute: () => {
        this.buckets[bucket].fillColor = "transparent";
      },
    });
  }

  public destroy() {
    this.runtime?.dispose();
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
