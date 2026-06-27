import { Entity } from "../engine/Entity";

export class Grid extends Entity {
  public x: number;
  public y: number;
  public rows: number;
  public cols: number;
  public cellWidth: number;
  public cellHeight: number;

  private cells: string[] = [];

  constructor(
    id: string,
    x: number,
    y: number,
    rows: number,
    cols: number,
    cw: number,
    ch: number,
  ) {
    super(id);
    this.x = x;
    this.y = y;
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = cw;
    this.cellHeight = ch;

    this.cells = Array.from({ length: rows * cols }, () => "transparent");
  }

  private cellIndex(r: number, c: number): number {
    return r * this.cols + c;
  }

  public setCellColor(r: number, c: number, color: string) {
    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
      this.cells[this.cellIndex(r, c)] = color;
    }
  }

  update(dt: number): void {
    // Basic static grid
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cx = this.x + c * this.cellWidth;
        const cy = this.y + r * this.cellHeight;

        ctx.fillStyle = this.cells[this.cellIndex(r, c)];
        ctx.fillRect(cx, cy, this.cellWidth, this.cellHeight);
        ctx.strokeRect(cx, cy, this.cellWidth, this.cellHeight);
      }
    }
  }
}
