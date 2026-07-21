import { describe, expect, it } from "vitest";
import {
  type PolicyLine,
  hitRate,
  pickVictimIndex,
  touchOnHit,
} from "./cachePolicy";

function lines(specs: Array<[string | null, number, number]>): PolicyLine[] {
  return specs.map(([tag, insertedAt, lastUsed]) => ({
    tag,
    insertedAt,
    lastUsed,
  }));
}

describe("pickVictimIndex", () => {
  it("prefers empty slots over filled lines", () => {
    const L = lines([
      ["A", 1, 5],
      [null, 0, 0],
      ["B", 2, 3],
    ]);
    expect(pickVictimIndex(L, "lru")).toBe(1);
    expect(pickVictimIndex(L, "fifo")).toBe(1);
  });

  it("LRU picks least recently used among full lines", () => {
    const L = lines([
      ["A", 1, 10],
      ["B", 2, 3],
      ["C", 3, 7],
    ]);
    expect(pickVictimIndex(L, "lru")).toBe(1); // B lastUsed=3
  });

  it("FIFO picks earliest insertion among full lines", () => {
    const L = lines([
      ["A", 5, 100],
      ["B", 1, 99],
      ["C", 3, 98],
    ]);
    expect(pickVictimIndex(L, "fifo")).toBe(1); // B insertedAt=1
  });

  it("throws on empty array", () => {
    expect(() => pickVictimIndex([], "lru")).toThrow(/empty/);
  });
});

describe("touchOnHit", () => {
  it("updates recency only for LRU", () => {
    expect(touchOnHit("lru")).toBe(true);
    expect(touchOnHit("fifo")).toBe(false);
  });
});

describe("hitRate", () => {
  it("returns null with no samples", () => {
    expect(hitRate(0, 0)).toBeNull();
  });
  it("computes ratio", () => {
    expect(hitRate(3, 1)).toBeCloseTo(0.75);
  });
});
