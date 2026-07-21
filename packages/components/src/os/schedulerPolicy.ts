/**
 * Pure process-scheduler policy helpers (testable without canvas).
 */

export type SchedulerAlgorithm = "round-robin" | "cfs";

export type SchedProcess = {
  id: string;
  /** CFS virtual runtime; lower runs first. */
  vruntime: number;
  /** Arrival / enqueue order for RR fairness fallback. */
  enqueueOrder: number;
};

/**
 * Pick next process: RR uses queue order (min enqueueOrder among ready);
 * CFS uses minimum vruntime.
 */
export function selectNextProcess(
  ready: readonly SchedProcess[],
  algorithm: SchedulerAlgorithm,
): SchedProcess | null {
  if (ready.length === 0) return null;
  if (algorithm === "cfs") {
    return ready.reduce((a, b) => (a.vruntime <= b.vruntime ? a : b));
  }
  return ready.reduce((a, b) => (a.enqueueOrder <= b.enqueueOrder ? a : b));
}

/** Clamp quantum to a sane educational range (ms of sim time). */
export function normalizeQuantum(ms: number | undefined): number {
  if (ms === undefined || !Number.isFinite(ms)) return 1000;
  return Math.min(10_000, Math.max(100, Math.floor(ms)));
}

/**
 * After a RR quantum, process returns to ready queue with new enqueue order.
 * CFS increases vruntime by quantum weight (simplified equal weight).
 */
export function afterRunSlice(
  proc: SchedProcess,
  algorithm: SchedulerAlgorithm,
  quantum: number,
  nextEnqueueOrder: number,
): SchedProcess {
  if (algorithm === "cfs") {
    return {
      ...proc,
      vruntime: proc.vruntime + quantum,
      enqueueOrder: nextEnqueueOrder,
    };
  }
  return { ...proc, enqueueOrder: nextEnqueueOrder };
}
