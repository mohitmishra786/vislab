/**
 * Lazy loaders for per-widget ESM chunks (#51).
 * Keeps the full catalog available while allowing single-widget pages to
 * download only the widget they need when using dynamic import.
 */

export type WidgetModule = Record<string, unknown>;

export type WidgetLoader = () => Promise<WidgetModule>;

/** Map PascalCase globalName → dynamic import of the widget module. */
export const widgetLoaders: Record<string, WidgetLoader> = {
  StorageComparison: () =>
    import("@vislab/components/widgets/StorageComparison"),
  CpuPipeline: () => import("@vislab/components/widgets/CpuPipeline"),
  CacheSimulator: () => import("@vislab/components/widgets/CacheSimulator"),
  BranchPredictor: () => import("@vislab/components/widgets/BranchPredictor"),
  TLBWalk: () => import("@vislab/components/widgets/TLBWalk"),
  ProcessScheduler: () => import("@vislab/components/widgets/ProcessScheduler"),
  VirtualMemory: () => import("@vislab/components/widgets/VirtualMemory"),
  SyscallTrace: () => import("@vislab/components/widgets/SyscallTrace"),
  InodeTree: () => import("@vislab/components/widgets/InodeTree"),
  SortRace: () => import("@vislab/components/widgets/SortRace"),
  BTreeOps: () => import("@vislab/components/widgets/BTreeOps"),
  GraphTraversal: () => import("@vislab/components/widgets/GraphTraversal"),
  HashCollision: () => import("@vislab/components/widgets/HashCollision"),
  Lexer: () => import("@vislab/components/widgets/Lexer"),
  Parser: () => import("@vislab/components/widgets/Parser"),
  CFGBuilder: () => import("@vislab/components/widgets/CFGBuilder"),
  RegisterAllocator: () =>
    import("@vislab/components/widgets/RegisterAllocator"),
};

export async function loadWidgetClass(
  globalName: string,
): Promise<
  new (
    el: HTMLElement,
    props?: Record<string, unknown>,
  ) => { destroy(): void }
> {
  const loader = widgetLoaders[globalName];
  if (!loader) {
    throw new Error(`No lazy loader for widget: ${globalName}`);
  }
  const mod = await loader();
  const Ctor = mod[globalName] as
    | (new (
        el: HTMLElement,
        props?: Record<string, unknown>,
      ) => { destroy(): void })
    | undefined;
  if (!Ctor) {
    throw new Error(
      `Module for ${globalName} does not export class ${globalName}`,
    );
  }
  return Ctor;
}
