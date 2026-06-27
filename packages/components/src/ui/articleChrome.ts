import type { Theme } from "@vislab/core";
import { resolveTheme } from "@vislab/core";

export type ArticleChromeVariant =
  | "article"
  | "diagram"
  | "toolbar"
  | "terminal";

export type ArticleChromeOptions = {
  title: string;
  themeName?: string;
  canvasHeight?: string;
  variant?: ArticleChromeVariant;
  /** Stable selector for e2e tests, e.g. `storage-comparison` */
  testId?: string;
  /** Optional controls on the right side of the header (toolbar / terminal). */
  headerActions?: HTMLElement | HTMLElement[];
};

/**
 * Shared embed frame: header + canvas region.
 * - `diagram` — compact schematic (pipelines).
 * - `toolbar` — balanced header + actions + canvas (caches, sorts).
 * - `terminal` — left accent rail, IDE-ish (lexer, schedulers).
 * - `article` — roomy (storage-style).
 */
export function createArticleChrome(options: ArticleChromeOptions): {
  wrapper: HTMLElement;
  header: HTMLElement;
  canvasMount: HTMLElement;
  theme: Theme;
} {
  const t = resolveTheme(options.themeName ?? "dark-premium");
  const variant = options.variant ?? "article";

  const defaultHeights: Record<ArticleChromeVariant, string> = {
    article: "280px",
    diagram: "168px",
    toolbar: "320px",
    terminal: "220px",
  };
  const canvasH =
    options.canvasHeight ?? defaultHeights[variant as ArticleChromeVariant];

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-vislab-widget", options.testId ?? options.title);
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.fontFamily = t.font;
  wrapper.style.backgroundColor = t.bg;
  wrapper.style.color = t.fg;
  wrapper.style.border = `1px solid ${t.border}`;
  wrapper.style.maxWidth = "100%";

  if (variant === "diagram" || variant === "toolbar") {
    wrapper.style.borderRadius = "6px";
    wrapper.style.overflow = "hidden";
  } else if (variant === "terminal") {
    wrapper.style.borderRadius = "4px";
    wrapper.style.overflow = "hidden";
    wrapper.style.borderLeft = `3px solid ${t.accent2}`;
    wrapper.style.backgroundColor = "#0a0a0a";
  } else {
    wrapper.style.borderRadius = "0";
    wrapper.style.overflow = "hidden";
  }

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.borderBottom = `1px solid ${t.border}`;
  header.style.gap = "10px";
  header.style.flexWrap = "wrap";

  if (variant === "diagram") {
    header.style.padding = "6px 10px";
  } else if (variant === "toolbar") {
    header.style.padding = "10px 14px";
  } else if (variant === "terminal") {
    header.style.padding = "8px 12px";
    header.style.backgroundColor = "#080808";
  } else {
    header.style.padding = "20px 24px";
  }

  const titleEl = document.createElement("h3");
  titleEl.textContent = options.title;
  titleEl.style.margin = "0";
  titleEl.style.flex = "1";
  titleEl.style.minWidth = "0";

  if (variant === "diagram") {
    titleEl.style.fontSize = "12px";
    titleEl.style.fontWeight = "600";
    titleEl.style.letterSpacing = "0.04em";
    titleEl.style.textTransform = "uppercase";
    titleEl.style.opacity = "0.92";
  } else if (variant === "toolbar") {
    titleEl.style.fontSize = "13px";
    titleEl.style.fontWeight = "600";
    titleEl.style.letterSpacing = "0.02em";
  } else if (variant === "terminal") {
    titleEl.style.fontSize = "12px";
    titleEl.style.fontWeight = "600";
    titleEl.style.textTransform = "uppercase";
    titleEl.style.letterSpacing = "0.06em";
    titleEl.style.color = t.accent2;
  } else {
    titleEl.style.fontSize = "16px";
    titleEl.style.fontWeight = "normal";
    titleEl.style.flex = "unset";
  }

  header.appendChild(titleEl);

  if (options.headerActions) {
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.gap = "8px";
    box.style.alignItems = "center";
    box.style.flexShrink = "0";
    const nodes = Array.isArray(options.headerActions)
      ? options.headerActions
      : [options.headerActions];
    for (const n of nodes) {
      box.appendChild(n);
    }
    header.appendChild(box);
  }

  wrapper.appendChild(header);

  const canvasWrap = document.createElement("div");
  canvasWrap.style.position = "relative";
  canvasWrap.style.backgroundColor = variant === "terminal" ? "#050505" : t.bg;

  if (variant === "diagram") {
    canvasWrap.style.padding = "6px 8px 8px";
  } else if (variant === "toolbar") {
    canvasWrap.style.padding = "10px 12px 14px";
  } else if (variant === "terminal") {
    canvasWrap.style.padding = "8px 10px 10px";
  } else {
    canvasWrap.style.padding = "32px 40px 40px";
  }

  const canvasMount = document.createElement("div");
  canvasMount.setAttribute("data-vislab-canvas", "");
  canvasMount.style.width = "100%";
  canvasMount.style.minHeight = canvasH;
  if (variant === "toolbar") {
    canvasMount.style.overflowX = "auto";
  }

  canvasWrap.appendChild(canvasMount);
  wrapper.appendChild(canvasWrap);

  return { wrapper, header, canvasMount, theme: t };
}
