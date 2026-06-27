import { describe, expect, it } from "vitest";
import { SimClock } from "./SimClock";

describe("SimClock", () => {
  it("accumulates sim time across ticks (after priming)", () => {
    const clock = new SimClock();
    clock.resume();
    const t0 = performance.now();
    clock.tick(t0);
    clock.tick(t0 + 100);
    expect(clock.simTime).toBeCloseTo(100, 0);
    clock.tick(t0 + 250);
    expect(clock.simTime).toBeCloseTo(250, 0);
  });

  it("respects speed multiplier", () => {
    const clock = new SimClock();
    clock.speed = 2;
    clock.resume();
    const t0 = performance.now();
    clock.tick(t0);
    clock.tick(t0 + 100);
    expect(clock.simTime).toBeCloseTo(200, 0);
  });

  it("does not advance when paused", () => {
    const clock = new SimClock();
    clock.resume();
    const t0 = performance.now();
    clock.tick(t0);
    clock.tick(t0 + 50);
    expect(clock.simTime).toBeCloseTo(50, 0);
    clock.pause();
    clock.tick(t0 + 150);
    expect(clock.simTime).toBeCloseTo(50, 0);
  });
});
