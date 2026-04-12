import { Entity } from './Entity';
import { SimClock } from './SimClock';
import { Scheduler } from './Scheduler';

export class Scene {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];
  
  public clock: SimClock;
  public scheduler: Scheduler;

  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;

    this.clock = new SimClock();
    this.scheduler = new Scheduler();

    // Handle high-dpi displays
    this.resize();
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  public removeEntity(id: string) {
    this.entities = this.entities.filter(e => e.id !== id);
  }

  public start() {
    if (this.animationFrameId === null) {
      this.clock.resume();
      this.loop(performance.now());
    }
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (time: number) => {
    const dt = this.clock.tick(time);

    // 1. Process scheduled events
    this.scheduler.update(this.clock.simTime);

    // 2. Update all entities
    for (const entity of this.entities) {
      entity.update(dt);
    }

    // 3. Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 4. Draw entities
    for (const entity of this.entities) {
      if (entity.visible) {
        entity.draw(this.ctx);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
