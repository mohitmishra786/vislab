import { describe, expect, it } from "vitest";
import {
  type PipelineInstruction,
  advanceInstructions,
  detectDataHazard,
} from "./pipelineHazards";

const STAGES = ["IF", "ID", "EX", "MEM", "WB"];

describe("detectDataHazard", () => {
  it("returns none when stages missing", () => {
    expect(detectDataHazard(["IF", "ID"], [])).toEqual({
      kind: "none",
      message: "",
      stallStageIndex: null,
    });
  });

  it("detects matching labels in EX and MEM", () => {
    const inst: PipelineInstruction[] = [
      { id: "1", stageIndex: 2, label: "I1" }, // EX
      { id: "2", stageIndex: 3, label: "I1" }, // MEM same label (demo hazard)
    ];
    const r = detectDataHazard(STAGES, inst);
    expect(r.kind).toBe("data");
    expect(r.stallStageIndex).toBe(2);
    expect(r.message).toMatch(/hazard/i);
  });

  it("no hazard for distinct labels", () => {
    const inst: PipelineInstruction[] = [
      { id: "1", stageIndex: 2, label: "I1" },
      { id: "2", stageIndex: 3, label: "I2" },
    ];
    expect(detectDataHazard(STAGES, inst).kind).toBe("none");
  });
});

describe("advanceInstructions", () => {
  it("increments stage and drops completed", () => {
    const inst: PipelineInstruction[] = [
      { id: "a", stageIndex: 0, label: "I1" },
      { id: "b", stageIndex: 4, label: "I2" },
    ];
    const next = advanceInstructions(inst, 5);
    expect(next).toEqual([{ id: "a", stageIndex: 1, label: "I1" }]);
  });
});
