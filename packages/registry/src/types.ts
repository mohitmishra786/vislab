export type VislabPropType = "string" | "number" | "boolean" | "string[]";

export interface VislabPropSchema {
  name: string;
  type: VislabPropType;
  description?: string;
  optional?: boolean;
}

export type VislabWidget = { destroy(): void };

export type VislabCategory =
  | "cpu"
  | "os"
  | "algorithms"
  | "compiler"
  | "storage";

export type VislabMaturity = "flagship" | "beta";

export interface VislabComponentEntry {
  /** Stable id, e.g. cpu-pipeline */
  id: string;
  /** PascalCase name matching IIFE export on `VisLab` */
  globalName: string;
  displayName: string;
  category: VislabCategory;
  description?: string;
  /**
   * Product maturity for Studio badges and docs.
   * flagship = full docs + SimClock polish; beta = works, thinner docs.
   */
  maturity?: VislabMaturity;
  /** Custom element tag (must contain a hyphen) */
  customElementTag: string;
  props?: VislabPropSchema[];
  create: (
    container: HTMLElement,
    props?: Record<string, unknown>,
  ) => VislabWidget;
}

export const FLAGSHIP_IDS = [
  "storage-comparison",
  "cpu-pipeline",
  "cache-simulator",
  "process-scheduler",
  "sort-race",
] as const;
