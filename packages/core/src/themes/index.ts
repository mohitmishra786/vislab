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

export const themes: Record<string, Theme> = {
  'dark-premium': {
    bg: '#111111',       // PlanetScale dark background
    surface: '#888888',  // Flat mid-gray for blocks
    border: '#333333',   // Subtle borders if needed
    fg: '#e4e4e7',       // Light gray text
    accent1: '#00e5ff',  // Cyan (NVMe)
    accent2: '#00e676',  // Bright Green (L1)
    accent3: '#ff5252',  // Red (HDD/Network)
    accent4: '#b388ff',  // Purple (SSD)
    font: '"JetBrains Mono", "Courier New", monospace', // Strict monospace everything
    monoFont: '"JetBrains Mono", "Courier New", monospace',
  },
  'light-academic': {
    bg: '#ffffff',
    surface: '#e2e8f0',
    border: '#cbd5e1',
    fg: '#334155',
    accent1: '#0ea5e9',
    accent2: '#10b981',
    accent3: '#ef4444',
    accent4: '#8b5cf6',
    font: '"JetBrains Mono", "Courier New", monospace',
    monoFont: '"JetBrains Mono", "Courier New", monospace',
  }
};
