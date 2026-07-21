import { describe, expect, it } from "vitest";
import {
  type SchedProcess,
  afterRunSlice,
  normalizeQuantum,
  selectNextProcess,
} from "./schedulerPolicy";

const ready: SchedProcess[] = [
  { id: "p1", vruntime: 50, enqueueOrder: 2 },
  { id: "p2", vruntime: 10, enqueueOrder: 0 },
  { id: "p3", vruntime: 30, enqueueOrder: 1 },
];

describe("selectNextProcess", () => {
  it("RR picks earliest enqueueOrder", () => {
    expect(selectNextProcess(ready, "round-robin")?.id).toBe("p2");
  });

  it("CFS picks lowest vruntime", () => {
    expect(selectNextProcess(ready, "cfs")?.id).toBe("p2");
  });

  it("CFS picks lower vruntime when order differs", () => {
    const r: SchedProcess[] = [
      { id: "a", vruntime: 100, enqueueOrder: 0 },
      { id: "b", vruntime: 5, enqueueOrder: 9 },
    ];
    expect(selectNextProcess(r, "cfs")?.id).toBe("b");
    expect(selectNextProcess(r, "round-robin")?.id).toBe("a");
  });

  it("returns null for empty ready queue", () => {
    expect(selectNextProcess([], "cfs")).toBeNull();
  });
});

describe("normalizeQuantum", () => {
  it("defaults and clamps", () => {
    expect(normalizeQuantum(undefined)).toBe(1000);
    expect(normalizeQuantum(50)).toBe(100);
    expect(normalizeQuantum(99999)).toBe(10_000);
    expect(normalizeQuantum(500)).toBe(500);
  });
});

describe("afterRunSlice", () => {
  it("CFS increases vruntime", () => {
    const p = afterRunSlice(
      { id: "x", vruntime: 10, enqueueOrder: 0 },
      "cfs",
      100,
      3,
    );
    expect(p.vruntime).toBe(110);
    expect(p.enqueueOrder).toBe(3);
  });

  it("RR only updates enqueue order", () => {
    const p = afterRunSlice(
      { id: "x", vruntime: 10, enqueueOrder: 0 },
      "round-robin",
      100,
      7,
    );
    expect(p.vruntime).toBe(10);
    expect(p.enqueueOrder).toBe(7);
  });
});
