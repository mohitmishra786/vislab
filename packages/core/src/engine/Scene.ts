import type { Entity } from "./Entity";
import { Scheduler } from "./Scheduler";
import { SimClock } from "./SimClock";

export class Scene {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entities: Entity[] = [];

  public clock: SimClock;
  public scheduler: Scheduler;

  private animationFrameId: number | null = null;
  private active = false;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityObserver: IntersectionObserver | null = null;
  private wantRunning = false;
  private startWhenVisible: boolean;

  /** CSS pixel size (logical), matches coordinate system after DPR transform */
  private cssWidth = 0;
  private cssHeight = 0;

  constructor(
    canvas: HTMLCanvasElement,
    options?: { autoResize?: boolean; startWhenVisible?: boolean },
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;

    this.clock = new SimClock();
    this.scheduler = new Scheduler();
    this.startWhenVisible = options?.startWhenVisible !== false;

    this.resize();

    const autoResize = options?.autoResize !== false;
    if (autoResize && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    }

    if (this.startWhenVisible && typeof IntersectionObserver !== "undefined") {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          if (visible && this.wantRunning && !this.active) {
            this.runLoop();
          } else if (!visible && this.active) {
            // Stop rAF only — do not change SimClock pause state
            this.stopAnimationFrame();
          }
        },
        { root: null, threshold: 0.05 },
      );
      this.visibilityObserver.observe(this.canvas);
    }
  }

  public resize() {
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || this.canvas.clientWidth || 300;
    const h = rect.height || this.canvas.clientHeight || 150;

    this.cssWidth = w;
    this.cssHeight = h;

    this.canvas.width = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));

    // Setting width/height resets context; establish CSS-pixel space
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public getLogicalSize() {
    return { width: this.cssWidth, height: this.cssHeight };
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  public removeEntity(id: string) {
    this.entities = this.entities.filter((e) => e.id !== id);
  }

  public start() {
    this.wantRunning = true;
    if (this.startWhenVisible && this.visibilityObserver) {
      // Defer rAF until canvas is on-screen (saves CPU on multi-widget pages)
      const rect = this.canvas.getBoundingClientRect();
      const inView =
        rect.bottom > 0 &&
        rect.top < (typeof window !== "undefined" ? window.innerHeight : 0);
      if (!inView) return;
    }
    this.runLoop();
  }

  public stop() {
    this.wantRunning = false;
    this.stopAnimationFrame();
    this.clock.pause();
  }

  private runLoop() {
    if (this.active) return;
    this.active = true;
    // Do not force-resume clock; honor user pause via SimClock
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private stopAnimationFrame() {
    this.active = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop animation, release observers, clear scheduled work and entities.
   */
  public dispose() {
    this.wantRunning = false;
    this.stopAnimationFrame();
    this.clock.pause();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
    this.scheduler.clear();
    this.entities = [];
  }

  private loop = (time: number) => {
    if (!this.active) return;

    const dt = this.clock.tick(time);

    this.scheduler.update(this.clock.simTime);

    for (const entity of this.entities) {
      entity.update(dt);
    }

    this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    for (const entity of this.entities) {
      if (entity.visible) {
        entity.draw(this.ctx);
      }
    }

    if (this.active) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  };
}
