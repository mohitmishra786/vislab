export interface Theme {
  bg: string;
  fg: string;
  surface: string;
  border: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  font: string;
  monoFont: string;
}

const darkPremium: Theme = {
  bg: "#111111",
  surface: "#888888",
  border: "#333333",
  fg: "#e4e4e7",
  accent1: "#00e5ff",
  accent2: "#00e676",
  accent3: "#ff5252",
  accent4: "#b388ff",
  font: '"JetBrains Mono", "Courier New", monospace',
  monoFont: '"JetBrains Mono", "Courier New", monospace',
};

export const themes: Record<string, Theme> = {
  "dark-premium": darkPremium,
  /** Alias used across @vislab/components (research doc naming). */
  "dark-terminal": darkPremium,
  "light-academic": {
    bg: "#ffffff",
    surface: "#e2e8f0",
    border: "#cbd5e1",
    fg: "#334155",
    accent1: "#0ea5e9",
    accent2: "#10b981",
    accent3: "#ef4444",
    accent4: "#8b5cf6",
    font: '"JetBrains Mono", "Courier New", monospace',
    monoFont: '"JetBrains Mono", "Courier New", monospace',
  },
  "high-contrast": {
    bg: "#000000",
    surface: "#1a1a1a",
    border: "#ffffff",
    fg: "#ffffff",
    accent1: "#00ffff",
    accent2: "#00ff00",
    accent3: "#ff6666",
    accent4: "#dd99ff",
    font: '"Courier New", Courier, monospace',
    monoFont: '"Courier New", Courier, monospace',
  },
};

const ALIASES: Record<string, string> = {
  dark: "dark-premium",
};

/**
 * Resolve a theme by id, with safe fallback to dark-premium.
 */
export function resolveTheme(name: string | undefined | null): Theme {
  if (!name) return themes["dark-premium"];
  const key = ALIASES[name] ?? name;
  return themes[key] ?? themes["dark-premium"];
}
