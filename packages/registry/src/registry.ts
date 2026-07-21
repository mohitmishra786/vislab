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
import {
  THEME_PROP,
  parseBoolean,
  parseNumber,
  parseString,
  parseStringArray,
} from "./props";
import type { VislabComponentEntry, VislabWidget } from "./types";

export const vislabRegistry: VislabComponentEntry[] = [
  {
    id: "storage-comparison",
    maturity: "flagship",
    globalName: "StorageComparison",
    displayName: "Storage latency race",
    category: "storage",
    description:
      "Relative latency race across L1, NVMe, SSD, and HDD storage tiers.",
    customElementTag: "vislab-storage-comparison",
    props: [
      THEME_PROP,
      {
        name: "speed",
        type: "number",
        optional: true,
        description: "SimClock multiplier (0.1–10)",
      },
    ],
    create: (el, props) =>
      new StorageComparison(el, {
        themeName: parseString(props, "themeName"),
        speed: parseNumber(props, "speed"),
      }),
  },
  {
    id: "cpu-pipeline",
    maturity: "flagship",
    globalName: "CpuPipeline",
    displayName: "CPU pipeline",
    category: "cpu",
    description: "Instruction flow through pipeline stages.",
    customElementTag: "vislab-cpu-pipeline",
    props: [
      THEME_PROP,
      {
        name: "stages",
        type: "string[]",
        optional: true,
        description: "Stage labels, e.g. IF,ID,EX,MEM,WB",
      },
      {
        name: "autoPlay",
        type: "boolean",
        optional: true,
        description: "Start animating on mount",
      },
    ],
    create: (el, props) =>
      new CpuPipeline(el, {
        stages: parseStringArray(props, "stages"),
        themeName: parseString(props, "themeName"),
        autoPlay: parseBoolean(props, "autoPlay", true),
      }),
  },
  {
    id: "cache-simulator",
    maturity: "flagship",
    globalName: "CacheSimulator",
    displayName: "Cache hierarchy",
    category: "cpu",
    description: "L1/L2/L3 cache hits, misses, and evictions.",
    customElementTag: "vislab-cache-simulator",
    props: [
      THEME_PROP,
      {
        name: "policy",
        type: "string",
        optional: true,
        description: 'Replacement policy: "lru" or "fifo"',
      },
      {
        name: "lineCount",
        type: "number",
        optional: true,
        description: "Number of memory lines (4–16)",
      },
    ],
    create: (el, props) =>
      new CacheSimulator(el, {
        themeName: parseString(props, "themeName"),
        policy: parseString(props, "policy") as "lru" | "fifo" | undefined,
        lineCount: parseNumber(props, "lineCount"),
      }),
  },
  {
    id: "branch-predictor",
    maturity: "beta",
    globalName: "BranchPredictor",
    displayName: "Branch predictor",
    category: "cpu",
    customElementTag: "vislab-branch-predictor",
    props: [THEME_PROP],
    create: (el, props) =>
      new BranchPredictor(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "tlb-walk",
    maturity: "beta",
    globalName: "TLBWalk",
    displayName: "TLB / page walk",
    category: "cpu",
    customElementTag: "vislab-tlb-walk",
    props: [THEME_PROP],
    create: (el, props) =>
      new TLBWalk(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "process-scheduler",
    maturity: "flagship",
    globalName: "ProcessScheduler",
    displayName: "Process scheduler",
    category: "os",
    customElementTag: "vislab-process-scheduler",
    props: [
      THEME_PROP,
      {
        name: "algorithm",
        type: "string",
        optional: true,
        description: '"round-robin" or "cfs"',
      },
      {
        name: "quantum",
        type: "number",
        optional: true,
        description: "Time slice in ms",
      },
      {
        name: "autoRun",
        type: "boolean",
        optional: true,
        description: "Start scheduling loop on mount (default true)",
      },
    ],
    create: (el, props) =>
      new ProcessScheduler(el, {
        themeName: parseString(props, "themeName"),
        algorithm: parseString(props, "algorithm") as
          | "round-robin"
          | "cfs"
          | undefined,
        quantum: parseNumber(props, "quantum"),
        autoRun: parseBoolean(props, "autoRun"),
      }),
  },
  {
    id: "virtual-memory",
    maturity: "beta",
    globalName: "VirtualMemory",
    displayName: "Virtual memory",
    category: "os",
    customElementTag: "vislab-virtual-memory",
    props: [
      THEME_PROP,
      {
        name: "pageCount",
        type: "number",
        optional: true,
        description: "Virtual pages to display (4–12)",
      },
    ],
    create: (el, props) =>
      new VirtualMemory(el, {
        themeName: parseString(props, "themeName"),
        pageCount: parseNumber(props, "pageCount"),
      }),
  },
  {
    id: "syscall-trace",
    maturity: "beta",
    globalName: "SyscallTrace",
    displayName: "Syscall trace",
    category: "os",
    customElementTag: "vislab-syscall-trace",
    props: [THEME_PROP],
    create: (el, props) =>
      new SyscallTrace(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "inode-tree",
    maturity: "beta",
    globalName: "InodeTree",
    displayName: "Inode tree",
    category: "os",
    customElementTag: "vislab-inode-tree",
    props: [THEME_PROP],
    create: (el, props) =>
      new InodeTree(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "sort-race",
    maturity: "flagship",
    globalName: "SortRace",
    displayName: "Sorting race",
    category: "algorithms",
    customElementTag: "vislab-sort-race",
    props: [
      THEME_PROP,
      {
        name: "arraySize",
        type: "number",
        optional: true,
        description: "Bars per array (6–20)",
      },
      {
        name: "seed",
        type: "number",
        optional: true,
        description: "PRNG seed for deterministic initial bar order",
      },
    ],
    create: (el, props) =>
      new SortRace(el, {
        themeName: parseString(props, "themeName"),
        arraySize: parseNumber(props, "arraySize"),
        seed: parseNumber(props, "seed"),
      }),
  },
  {
    id: "btree-ops",
    maturity: "beta",
    globalName: "BTreeOps",
    displayName: "B-tree ops",
    category: "algorithms",
    customElementTag: "vislab-btree-ops",
    props: [THEME_PROP],
    create: (el, props) =>
      new BTreeOps(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "graph-traversal",
    maturity: "beta",
    globalName: "GraphTraversal",
    displayName: "Graph traversal",
    category: "algorithms",
    customElementTag: "vislab-graph-traversal",
    props: [
      THEME_PROP,
      {
        name: "algorithm",
        type: "string",
        optional: true,
        description: '"bfs" or "dfs"',
      },
    ],
    create: (el, props) =>
      new GraphTraversal(el, {
        themeName: parseString(props, "themeName"),
        algorithm: parseString(props, "algorithm") as "bfs" | "dfs" | undefined,
      }),
  },
  {
    id: "hash-collision",
    maturity: "beta",
    globalName: "HashCollision",
    displayName: "Hash collisions",
    category: "algorithms",
    customElementTag: "vislab-hash-collision",
    props: [THEME_PROP],
    create: (el, props) =>
      new HashCollision(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "lexer",
    maturity: "beta",
    globalName: "Lexer",
    displayName: "Lexer",
    category: "compiler",
    customElementTag: "vislab-lexer",
    props: [
      THEME_PROP,
      {
        name: "source",
        type: "string",
        optional: true,
        description: "Source code to tokenize",
      },
    ],
    create: (el, props) =>
      new Lexer(el, {
        themeName: parseString(props, "themeName"),
        source: parseString(props, "source"),
      }),
  },
  {
    id: "parser",
    maturity: "beta",
    globalName: "Parser",
    displayName: "Parser",
    category: "compiler",
    customElementTag: "vislab-parser",
    props: [THEME_PROP],
    create: (el, props) =>
      new Parser(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "cfg-builder",
    maturity: "beta",
    globalName: "CFGBuilder",
    displayName: "CFG builder",
    category: "compiler",
    customElementTag: "vislab-cfg-builder",
    props: [THEME_PROP],
    create: (el, props) =>
      new CFGBuilder(el, { themeName: parseString(props, "themeName") }),
  },
  {
    id: "register-allocator",
    maturity: "beta",
    globalName: "RegisterAllocator",
    displayName: "Register allocation",
    category: "compiler",
    customElementTag: "vislab-register-allocator",
    props: [THEME_PROP],
    create: (el, props) =>
      new RegisterAllocator(el, {
        themeName: parseString(props, "themeName"),
      }),
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

/** Register a third-party widget at runtime (see #32). */
export function registerVislabWidget(entry: VislabComponentEntry): void {
  if (byGlobal.has(entry.globalName)) {
    throw new Error(`Widget already registered: ${entry.globalName}`);
  }
  if (byId.has(entry.id)) {
    throw new Error(`Widget id already registered: ${entry.id}`);
  }
  vislabRegistry.push(entry);
  byGlobal.set(entry.globalName, entry);
  byId.set(entry.id, entry);
}

/**
 * Render a visible error into a host element when a widget fails to mount.
 * Used by React/data-vislab adapters so authors do not see a blank div.
 */
export function renderVislabMountError(
  container: HTMLElement,
  message: string,
): void {
  container.replaceChildren();
  const box = document.createElement("div");
  box.setAttribute("role", "alert");
  box.setAttribute("data-vislab-error", "true");
  box.style.fontFamily = '"JetBrains Mono", "Courier New", monospace';
  box.style.fontSize = "13px";
  box.style.padding = "16px";
  box.style.border = "1px solid #ef4444";
  box.style.background = "#1a0a0a";
  box.style.color = "#fecaca";
  box.style.borderRadius = "6px";
  box.textContent = message;
  container.appendChild(box);
}

export function createVislabComponent(
  globalName: string,
  container: HTMLElement,
  props?: Record<string, unknown>,
): VislabWidget {
  const entry = getVislabEntryByGlobalName(globalName);
  if (!entry) {
    const known = vislabRegistry.map((e) => e.globalName).join(", ");
    const message = `Unknown VisLab component: "${globalName}". Known: ${known}`;
    renderVislabMountError(container, message);
    throw new Error(message);
  }
  return entry.create(container, props);
}
