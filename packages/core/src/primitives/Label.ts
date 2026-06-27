import { Entity } from "../engine/Entity";

export class Label extends Entity {
  public x: number;
  public y: number;
  public text: string;
  public color = "#d4d4d4";
  public font = '14px "Courier New", Courier, monospace';
  public align: CanvasTextAlign = "center";

  constructor(id: string, text: string, x: number, y: number) {
    super(id);
    this.text = text;
    this.x = x;
    this.y = y;
  }

  update(dt: number): void {
    // Static text by default
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = this.align;
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x, this.y);
  }
}
