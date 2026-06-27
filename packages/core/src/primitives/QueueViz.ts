import { Entity } from "../engine/Entity";
import { AnimatedRect } from "./AnimatedRect";

export class QueueViz extends Entity {
  public x: number;
  public y: number;
  public itemWidth = 35;
  public itemHeight = 35;
  public capacity = 5;
  public trackTint = "rgba(255,255,255,0.02)";
  public trackBorder = "rgba(255, 255, 255, 0.1)";

  private items: AnimatedRect[] = [];

  constructor(id: string, x: number, y: number) {
    super(id);
    this.x = x;
    this.y = y;
  }

  public enqueue(label: string, color: string) {
    if (this.items.length >= this.capacity) return;

    // Start falling from top slightly
    const startX = this.x - 50;
    const rect = new AnimatedRect(
      `${this.id}-item-${this.items.length}`,
      startX,
      this.y - 15,
      this.itemWidth,
      this.itemHeight,
    );
    rect.label = label;
    rect.fillColor = color;
    rect.strokeColor = "transparent";

    this.items.push(rect);
    this.layout();
  }

  public dequeue(): AnimatedRect | undefined {
    const item = this.items.shift();
    if (item) {
      item.moveTo(this.x + this.capacity * (this.itemWidth + 10) + 40, item.y);
      // Let it fade out naturally or we just let it exist off-screen
    }
    this.layout();
    return item;
  }

  private layout() {
    for (let i = 0; i < this.items.length; i++) {
      const targetX = this.x + 10 + i * (this.itemWidth + 10); // inner padding 10
      this.items[i].moveTo(targetX, this.y + 10);
    }
  }

  update(dt: number): void {
    for (const item of this.items) {
      item.update(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Draw sleek queue track (MacOS dock style)
    const qWidth = this.capacity * (this.itemWidth + 10) + 10;
    const qHeight = this.itemHeight + 20;

    ctx.save();
    ctx.fillStyle = this.trackTint;
    ctx.strokeStyle = this.trackBorder;
    ctx.lineWidth = 1;

    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(this.x, this.y, qWidth, qHeight, 12);
    } else {
      ctx.rect(this.x, this.y, qWidth, qHeight);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for (const item of this.items) {
      item.draw(ctx);
    }
  }
}
