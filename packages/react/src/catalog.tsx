import type React from "react";
import { VislabMount } from "./VislabMount";

export const StorageComparison: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="StorageComparison" {...p} />
);

export const CpuPipeline: React.FC<{
  className?: string;
  stages?: string[];
}> = (p) => <VislabMount component="CpuPipeline" {...p} />;

export const CacheSimulator: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="CacheSimulator" {...p} />
);

export const BranchPredictor: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="BranchPredictor" {...p} />
);

export const TLBWalk: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="TLBWalk" {...p} />
);

export const ProcessScheduler: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="ProcessScheduler" {...p} />
);

export const VirtualMemory: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="VirtualMemory" {...p} />
);

export const SyscallTrace: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="SyscallTrace" {...p} />
);

export const InodeTree: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="InodeTree" {...p} />
);

export const SortRace: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="SortRace" {...p} />
);

export const BTreeOps: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="BTreeOps" {...p} />
);

export const GraphTraversal: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="GraphTraversal" {...p} />
);

export const HashCollision: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="HashCollision" {...p} />
);

export const Lexer: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="Lexer" {...p} />
);

export const Parser: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="Parser" {...p} />
);

export const CFGBuilder: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="CFGBuilder" {...p} />
);

export const RegisterAllocator: React.FC<{ className?: string }> = (p) => (
  <VislabMount component="RegisterAllocator" {...p} />
);
