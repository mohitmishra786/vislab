import { defineConfig } from "tsup";

/**
 * Multi-entry build for tree-shakeable ESM/CJS + full IIFE catalog (#51).
 * Per-widget ESM paths enable lazy loading via `@vislab/components/widgets/*`.
 */
const widgetEntries = {
  index: "src/index.ts",
  "widgets/StorageComparison": "src/storage/StorageComparison.ts",
  "widgets/CpuPipeline": "src/cpu/CpuPipeline.ts",
  "widgets/CacheSimulator": "src/cpu/CacheSimulator.ts",
  "widgets/BranchPredictor": "src/cpu/BranchPredictor.ts",
  "widgets/TLBWalk": "src/cpu/TLBWalk.ts",
  "widgets/ProcessScheduler": "src/os/ProcessScheduler.ts",
  "widgets/VirtualMemory": "src/os/VirtualMemory.ts",
  "widgets/SyscallTrace": "src/os/SyscallTrace.ts",
  "widgets/InodeTree": "src/os/InodeTree.ts",
  "widgets/SortRace": "src/algorithms/SortRace.ts",
  "widgets/BTreeOps": "src/algorithms/BTreeOps.ts",
  "widgets/GraphTraversal": "src/algorithms/GraphTraversal.ts",
  "widgets/HashCollision": "src/algorithms/HashCollision.ts",
  "widgets/Lexer": "src/compiler/Lexer.ts",
  "widgets/Parser": "src/compiler/Parser.ts",
  "widgets/CFGBuilder": "src/compiler/CFGBuilder.ts",
  "widgets/RegisterAllocator": "src/compiler/RegisterAllocator.ts",
} as const;

export default defineConfig([
  // ESM/CJS library + per-widget chunks (@vislab/core stays external)
  {
    entry: widgetEntries,
    format: ["cjs", "esm"],
    dts: true,
    splitting: true,
    clean: true,
    treeshake: true,
    external: ["@vislab/core"],
    outDir: "dist",
  },
  // Full catalog IIFE for CDN / CLI (bundles core).
  // Entry key must be `index` so tsup emits `index.global.js` (not `index.global.global.js`).
  {
    entry: { index: "src/index.ts" },
    format: ["iife"],
    globalName: "VisLab",
    dts: false,
    clean: false,
    noExternal: ["@vislab/core"],
    outDir: "dist",
  },
]);
