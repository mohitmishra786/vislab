/** Shared prop parsers for registry create() factories */

export function parseString(
  props: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!props || props[key] === undefined) return undefined;
  return String(props[key]);
}

export function parseNumber(
  props: Record<string, unknown> | undefined,
  key: string,
  fallback?: number,
): number | undefined {
  if (!props || props[key] === undefined) return fallback;
  const n = Number(props[key]);
  return Number.isFinite(n) ? n : fallback;
}

export function parseBoolean(
  props: Record<string, unknown> | undefined,
  key: string,
  fallback = false,
): boolean {
  if (!props || props[key] === undefined) return fallback;
  const v = props[key];
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "1";
  return Boolean(v);
}

export function parseStringArray(
  props: Record<string, unknown> | undefined,
  key: string,
): string[] | undefined {
  if (!props || props[key] === undefined) return undefined;
  const s = props[key];
  if (Array.isArray(s)) return s.map(String);
  if (typeof s === "string") {
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return undefined;
}

export const THEME_PROP = {
  name: "themeName",
  type: "string" as const,
  optional: true,
  description: 'Theme id, e.g. "dark-premium"',
};