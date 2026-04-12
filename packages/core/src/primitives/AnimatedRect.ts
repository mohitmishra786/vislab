import { Entity } from '../engine/Entity';

export class AnimatedRect extends Entity {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  
  public fillColor: string;
  public strokeColor: string;
  public label: string;
  public labelColor: string = '#111'; // High contrast text on gray bg by default
  public textColorOverride: string | null = null;
  public labelAlign: 'center' | 'left' | 'right' = 'center';
  
  public velocity: number = 0; // if > 0, use constant velocity mode (px/sim-ms)
  
  private targetX: number;
  private targetY: number;

  constructor(id: string, x: number, y: number, w: number, h: number) {
    super(id);
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.width = w;
    this.height = h;
    this.fillColor = 'transparent';
    this.strokeColor = 'transparent';
    this.label = '';
  }

  public moveTo(x: number, y: number, velocity: number = 0) {
    this.targetX = x;
    this.targetY = y;
    if (velocity > 0) {
        this.velocity = velocity;
    }
  }

  update(dt: number): void {
    if (this.velocity > 0) {
        // Linear movement mode
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 1) {
            const moveDist = this.velocity * dt;
            const ratio = Math.min(1.0, moveDist / dist);
            this.x += dx * ratio;
            this.y += dy * ratio;
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
            this.velocity = 0; // stop moving
        }
    } else {
        // Exponential decay mode
        const speed = Math.min(1.0, (0.15 / 16.6) * dt); 
        if (Math.abs(this.targetX - this.x) > 0.1) this.x += (this.targetX - this.x) * speed;
        if (Math.abs(this.targetY - this.y) > 0.1) this.y += (this.targetY - this.y) * speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Pure flat rects (PlanetScale aesthetics)
    if (this.fillColor !== 'transparent') {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    if (this.strokeColor !== 'transparent') {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 1; // Strict 1px thin lines if any
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    // Text Rendering Logic
    if (this.label) {
      if (this.textColorOverride) {
        ctx.fillStyle = this.textColorOverride;
      } else {
        ctx.fillStyle = this.labelColor;
      }
      ctx.font = '14px "JetBrains Mono", "Courier New", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = this.labelAlign;
      
      let textX = this.x + this.width / 2;
      if (this.labelAlign === 'left') {
          textX = this.x + 10;
      }

      ctx.fillText(this.label, textX, this.y + this.height / 2);
    }

    ctx.restore();
  }
}
