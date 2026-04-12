import { Entity } from '../engine/Entity';

export class Arrow extends Entity {
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public color: string = '#d4d4d4';
  public animatedOffset: number = 0;
  public isAnimating: boolean = false;

  constructor(id: string, startX: number, startY: number, endX: number, endY: number) {
    super(id);
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  update(dt: number): void {
    if (this.isAnimating) {
      this.animatedOffset += 0.05 * dt;
      if (this.animatedOffset > Math.PI * 2) {
        this.animatedOffset -= Math.PI * 2;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);

    if (this.isAnimating) {
      ctx.setLineDash([10, 5]);
      ctx.lineDashOffset = -this.animatedOffset * 10;
    } else {
      ctx.setLineDash([]);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw arrowhead
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
    ctx.beginPath();
    ctx.moveTo(this.endX, this.endY);
    ctx.lineTo(this.endX - 10 * Math.cos(angle - Math.PI / 6), this.endY - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(this.endX - 10 * Math.cos(angle + Math.PI / 6), this.endY - 10 * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(this.endX, this.endY);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
