/**
 * Pure cache replacement policy helpers (testable without canvas).
 *
 * Pedagogical model: each line tracks `insertedAt` (FIFO) and `lastUsed` (LRU).
 * Empty lines (tag === null) are preferred victims before eviction.
 */

export type CachePolicy = "lru" | "fifo";

export type PolicyLine = {
  tag: string | null;
  /** Access counter when line was filled (FIFO order). */
  insertedAt: number;
  /** Access counter of last hit or fill (LRU recency). */
  lastUsed: number;
};

/**
 * Choose eviction victim index.
 * Empty slots always win. Otherwise:
 * - LRU: smallest lastUsed
 * - FIFO: smallest insertedAt
 */
export function pickVictimIndex(
  lines: readonly PolicyLine[],
  policy: CachePolicy,
): number {
  if (lines.length === 0) {
    throw new Error("pickVictimIndex: empty line array");
  }
  let best = 0;
  for (let i = 1; i < lines.length; i++) {
    const a = lines[best];
    const b = lines[i];
    if (a.tag === null && b.tag !== null) continue;
    if (b.tag === null && a.tag !== null) {
      best = i;
      continue;
    }
    if (policy === "fifo") {
      if (b.insertedAt < a.insertedAt) best = i;
    } else if (b.lastUsed < a.lastUsed) {
      best = i;
    }
  }
  return best;
}

/** Whether a hit should bump lastUsed (LRU yes, FIFO no). */
export function touchOnHit(policy: CachePolicy): boolean {
  return policy === "lru";
}

export function hitRate(hits: number, misses: number): number | null {
  const total = hits + misses;
  if (total === 0) return null;
  return hits / total;
}
