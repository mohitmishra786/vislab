import {
  BTreeOps,
  BranchPredictor,
  CFGBuilder,
  CacheSimulator,
  CpuPipeline,
  GraphTraversal,
  HashCollision,
  InodeTree,
  Lexer,
  Parser,
  ProcessScheduler,
  RegisterAllocator,
  SortRace,
  StorageComparison,
  SyscallTrace,
  TLBWalk,
  VirtualMemory,
} from "@vislab/components";
import type { VislabComponentEntry, VislabWidget } from "./types";

function parseStages(props?: Record<string, unknown>): string[] | undefined {
  if (!props || props.stages === undefined) return undefined;
  const s = props.stages;
  if (Array.isArray(s)) return s.map(String);
  if (typeof s === "string") {
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return undefined;
}

export const vislabRegistry: VislabComponentEntry[] = [
  {
    id: "storage-comparison",
    globalName: "StorageComparison",
    displayName: "Storage I/O latency",
    category: "storage",
    description:
      "Relative latency comparison across storage tiers (Ben Dicken–style).",
    customElementTag: "vislab-storage-comparison",
    create: (el) => new StorageComparison(el),
  },
  {
    id: "cpu-pipeline",
    globalName: "CpuPipeline",
    displayName: "CPU pipeline",
    category: "cpu",
    description: "Instruction flow through pipeline stages.",
    customElementTag: "vislab-cpu-pipeline",
    props: [
      {
        name: "stages",
        type: "string[]",
        optional: true,
        description: "Stage labels, e.g. IF,ID,EX,MEM,WB",
      },
    ],
    create: (el, props) => new CpuPipeline(el, parseStages(props)),
  },
  {
    id: "cache-simulator",
    globalName: "CacheSimulator",
    displayName: "Cache hierarchy",
    category: "cpu",
    customElementTag: "vislab-cache-simulator",
    create: (el) => new CacheSimulator(el),
  },
  {
    id: "branch-predictor",
    globalName: "BranchPredictor",
    displayName: "Branch predictor",
    category: "cpu",
    customElementTag: "vislab-branch-predictor",
    create: (el) => new BranchPredictor(el),
  },
  {
    id: "tlb-walk",
    globalName: "TLBWalk",
    displayName: "TLB / page walk",
    category: "cpu",
    customElementTag: "vislab-tlb-walk",
    create: (el) => new TLBWalk(el),
  },
  {
    id: "process-scheduler",
    globalName: "ProcessScheduler",
    displayName: "Process scheduler",
    category: "os",
    customElementTag: "vislab-process-scheduler",
    create: (el) => new ProcessScheduler(el),
  },
  {
    id: "virtual-memory",
    globalName: "VirtualMemory",
    displayName: "Virtual memory",
    category: "os",
    customElementTag: "vislab-virtual-memory",
    create: (el) => new VirtualMemory(el),
  },
  {
    id: "syscall-trace",
    globalName: "SyscallTrace",
    displayName: "Syscall trace",
    category: "os",
    customElementTag: "vislab-syscall-trace",
    create: (el) => new SyscallTrace(el),
  },
  {
    id: "inode-tree",
    globalName: "InodeTree",
    displayName: "Inode tree",
    category: "os",
    customElementTag: "vislab-inode-tree",
    create: (el) => new InodeTree(el),
  },
  {
    id: "sort-race",
    globalName: "SortRace",
    displayName: "Sorting race",
    category: "algorithms",
    customElementTag: "vislab-sort-race",
    create: (el) => new SortRace(el),
  },
  {
    id: "btree-ops",
    globalName: "BTreeOps",
    displayName: "B-tree ops",
    category: "algorithms",
    customElementTag: "vislab-btree-ops",
    create: (el) => new BTreeOps(el),
  },
  {
    id: "graph-traversal",
    globalName: "GraphTraversal",
    displayName: "Graph traversal",
    category: "algorithms",
    customElementTag: "vislab-graph-traversal",
    create: (el) => new GraphTraversal(el),
  },
  {
    id: "hash-collision",
    globalName: "HashCollision",
    displayName: "Hash collisions",
    category: "algorithms",
    customElementTag: "vislab-hash-collision",
    create: (el) => new HashCollision(el),
  },
  {
    id: "lexer",
    globalName: "Lexer",
    displayName: "Lexer",
    category: "compiler",
    customElementTag: "vislab-lexer",
    create: (el) => new Lexer(el),
  },
  {
    id: "parser",
    globalName: "Parser",
    displayName: "Parser",
    category: "compiler",
    customElementTag: "vislab-parser",
    create: (el) => new Parser(el),
  },
  {
    id: "cfg-builder",
    globalName: "CFGBuilder",
    displayName: "CFG builder",
    category: "compiler",
    customElementTag: "vislab-cfg-builder",
    create: (el) => new CFGBuilder(el),
  },
  {
    id: "register-allocator",
    globalName: "RegisterAllocator",
    displayName: "Register allocation",
    category: "compiler",
    customElementTag: "vislab-register-allocator",
    create: (el) => new RegisterAllocator(el),
  },
];

const byGlobal = new Map<string, VislabComponentEntry>();
const byId = new Map<string, VislabComponentEntry>();

for (const entry of vislabRegistry) {
  byGlobal.set(entry.globalName, entry);
  byId.set(entry.id, entry);
}

export function getVislabEntryByGlobalName(
  name: string,
): VislabComponentEntry | undefined {
  return byGlobal.get(name);
}

export function getVislabEntryById(
  id: string,
): VislabComponentEntry | undefined {
  return byId.get(id);
}

export function createVislabComponent(
  globalName: string,
  container: HTMLElement,
  props?: Record<string, unknown>,
): VislabWidget {
  const entry = getVislabEntryByGlobalName(globalName);
  if (!entry) {
    throw new Error(`Unknown VisLab component: ${globalName}`);
  }
  return entry.create(container, props);
}
