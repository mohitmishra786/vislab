import { Entity } from '../engine/Entity';

export class AnimatedArc extends Entity {
  public x: number;
  public y: number;
  public radius: number;
  public startAngle: number;
  public endAngle: number;
  public fillColor: string = 'transparent';
  public strokeColor: string = '#d4d4d4';
  
  public rotationSpeed: number = 0;
  private currentRotation: number = 0;

  constructor(id: string, x: number, y: number, r: number) {
    super(id);
    this.x = x;
    this.y = y;
    this.radius = r;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
  }

  update(dt: number): void {
    if (this.rotationSpeed > 0) {
      this.currentRotation += this.rotationSpeed * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.currentRotation);
    
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle);
    
    if (this.fillColor !== 'transparent') ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
