/**
 * Pure 5-stage pipeline hazard helpers (testable without canvas).
 */

export type PipelineInstruction = {
  id: string;
  /** Stage index 0..n-1 */
  stageIndex: number;
  /** Instruction label used for crude data-hazard matching in the demo. */
  label: string;
};

export type HazardResult = {
  kind: "none" | "data";
  message: string;
  /** Stage index where a stall bubble would appear (EX), if any. */
  stallStageIndex: number | null;
};

/**
 * Detect a simplified RAW-style data hazard when the same instruction label
 * occupies both EX and MEM (demo model used by CpuPipeline).
 */
export function detectDataHazard(
  stages: readonly string[],
  instructions: readonly PipelineInstruction[],
): HazardResult {
  const exIdx = stages.findIndex((s) => s === "EX" || s.toUpperCase() === "EX");
  const memIdx = stages.findIndex(
    (s) => s === "MEM" || s.toUpperCase() === "MEM",
  );
  if (exIdx < 0 || memIdx < 0) {
    return { kind: "none", message: "", stallStageIndex: null };
  }

  const inEx = instructions.find((i) => i.stageIndex === exIdx);
  const inMem = instructions.find((i) => i.stageIndex === memIdx);
  if (inEx && inMem && inEx.label === inMem.label) {
    return {
      kind: "data",
      message: "⚠ data hazard — stall bubble inserted",
      stallStageIndex: exIdx,
    };
  }
  return { kind: "none", message: "", stallStageIndex: null };
}

/**
 * Advance one instruction one stage; drop when past last stage.
 * Returns updated list (does not mutate input).
 */
export function advanceInstructions(
  instructions: readonly PipelineInstruction[],
  stageCount: number,
): PipelineInstruction[] {
  return instructions
    .map((i) => ({ ...i, stageIndex: i.stageIndex + 1 }))
    .filter((i) => i.stageIndex < stageCount);
}
