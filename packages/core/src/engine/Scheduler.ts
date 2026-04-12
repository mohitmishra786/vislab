export interface IOEvent {
  id: string;
  triggerTime: number; // The simulation time this should execute
  execute: () => void;
}

export class Scheduler {
  private events: IOEvent[] = [];

  public schedule(event: IOEvent) {
    this.events.push(event);
    // Keep sorted mostly by trigger time
    this.events.sort((a, b) => a.triggerTime - b.triggerTime);
  }

  public update(currentSimTime: number) {
    while (this.events.length > 0 && this.events[0].triggerTime <= currentSimTime) {
      const ev = this.events.shift();
      if (ev) {
        ev.execute();
      }
    }
  }

  public clear() {
    this.events = [];
  }
}
