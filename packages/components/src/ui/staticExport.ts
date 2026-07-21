import type { Theme } from "@vislab/core";
import { styleVislabButton } from "./vislabButtons";

export type StaticExportControl = {
  root: HTMLElement;
  dispose: () => void;
};

/**
 * Build a print/a11y-friendly SVG twin: title + summary + canvas raster snapshot.
 * Downloadable as .svg — useful for static docs and screen-reader-adjacent exports.
 */
export function buildStaticA11ySvg(options: {
  title: string;
  summary: string;
  canvas: HTMLCanvasElement;
  width?: number;
}): string {
  const w = options.width ?? Math.max(320, options.canvas.clientWidth || 640);
  const h = Math.max(120, options.canvas.clientHeight || 240);
  let dataUrl = "";
  try {
    dataUrl = options.canvas.toDataURL("image/png");
  } catch {
    dataUrl = "";
  }
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const textBlockHeight = 80;
  const totalH = h + textBlockHeight + 24;
  const imageBlock = dataUrl
    ? `<image href="${dataUrl}" x="0" y="${textBlockHeight}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" />`
    : `<rect x="0" y="${textBlockHeight}" width="${w}" height="${h}" fill="#111" /><text x="12" y="${textBlockHeight + 24}" fill="#e4e4e7" font-family="monospace" font-size="12">Canvas snapshot unavailable</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(options.title)}</title>
  <desc id="desc">${esc(options.summary)}</desc>
  <rect width="100%" height="100%" fill="#0a0a0a"/>
  <text x="12" y="22" fill="#e4e4e7" font-family="ui-monospace, monospace" font-size="14" font-weight="600">${esc(options.title)}</text>
  <foreignObject x="12" y="32" width="${w - 24}" height="${textBlockHeight - 20}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color:#a1a1aa;font:12px/1.4 ui-monospace,monospace;white-space:pre-wrap">${esc(options.summary)}</div>
  </foreignObject>
  ${imageBlock}
</svg>
`;
}

export function downloadTextFile(
  filename: string,
  contents: string,
  mime = "image/svg+xml",
): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Header control: export static SVG a11y twin of the current canvas + summary.
 */
export function createStaticExportControl(
  theme: Theme,
  options: {
    canvas: HTMLCanvasElement;
    title: string;
    getSummary: () => string;
  },
): StaticExportControl {
  const root = document.createElement("div");
  root.style.display = "inline-flex";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Static";
  styleVislabButton(
    btn,
    theme,
    "ghost",
    "Download static SVG accessibility twin",
  );
  btn.addEventListener("click", () => {
    const svg = buildStaticA11ySvg({
      title: options.title,
      summary: options.getSummary(),
      canvas: options.canvas,
    });
    const safe = options.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    downloadTextFile(`vislab-${safe || "widget"}.svg`, svg);
  });
  root.appendChild(btn);
  return { root, dispose: () => {} };
}
