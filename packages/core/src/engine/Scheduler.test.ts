import { describe, expect, it, vi } from "vitest";
import { Scheduler } from "./Scheduler";

describe("Scheduler", () => {
  it("runs events when sim time reaches trigger", () => {
    const s = new Scheduler();
    const fn = vi.fn();
    s.schedule({ id: "a", triggerTime: 100, execute: fn });
    s.update(50);
    expect(fn).not.toHaveBeenCalled();
    s.update(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("runs multiple events in order", () => {
    const s = new Scheduler();
    const order: string[] = [];
    s.schedule({ id: "2", triggerTime: 20, execute: () => order.push("2") });
    s.schedule({ id: "1", triggerTime: 10, execute: () => order.push("1") });
    s.update(25);
    expect(order).toEqual(["1", "2"]);
  });
});
