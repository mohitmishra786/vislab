export class SimClock {
  private speedMultiplier = 1.0;
  private isPaused = false;
  private lastRealTime = 0;
  private _simTime = 0;

  public get simTime(): number {
    return this._simTime;
  }

  public get speed(): number {
    return this.speedMultiplier;
  }

  public set speed(val: number) {
    this.speedMultiplier = Math.max(0.1, Math.min(val, 10.0));
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.lastRealTime = performance.now();
  }

  public togglePause() {
    this.isPaused ? this.resume() : this.pause();
  }

  /**
   * Tick the clock forward and return the simulation delta
   */
  public tick(realTimeNow: number): number {
    if (this.lastRealTime === 0) {
      this.lastRealTime = realTimeNow;
    }

    const realDt = realTimeNow - this.lastRealTime;
    this.lastRealTime = realTimeNow;

    if (this.isPaused) return 0;

    const simDt = realDt * this.speedMultiplier;
    this._simTime += simDt;

    return simDt;
  }
}
