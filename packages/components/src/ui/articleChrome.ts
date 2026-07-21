import type { Theme } from "@vislab/core";
import { resolveTheme } from "@vislab/core";
import {
  createSrOnlySummary,
  decorateCanvasA11y,
  prefersReducedMotion,
} from "./a11y";

export type ArticleChromeVariant =
  | "article"
  | "diagram"
  | "toolbar"
  | "terminal";

/** Tag a widget root for e2e selectors (used by bare-canvas widgets). */
export function tagWidgetRoot(el: HTMLElement, testId: string): void {
  el.setAttribute("data-vislab-widget", testId);
}

export type ArticleChromeOptions = {
  title: string;
  themeName?: string;
  canvasHeight?: string;
  variant?: ArticleChromeVariant;
  /** Stable selector for e2e tests, e.g. `storage-comparison` */
  testId?: string;
  /** Optional controls on the right side of the header (toolbar / terminal). */
  headerActions?: HTMLElement | HTMLElement[];
  /**
   * Initial accessible description of the visualization
   * (screen readers + crawlable text). Update via setSummary().
   */
  summary?: string;
  /** Minimum content width before horizontal scroll (CSS). */
  minWidth?: string;
};

export type ArticleChrome = {
  wrapper: HTMLElement;
  header: HTMLElement;
  canvasMount: HTMLElement;
  theme: Theme;
  titleId: string;
  summaryId: string;
  /** Update the SR/crawlable text summary of the simulation. */
  setSummary: (text: string) => void;
  /**
   * Create a canvas with role=img, resize styles, and a11y labels.
   * Appends into canvasMount.
   */
  prepareCanvas: (opts?: {
    height?: string;
    minWidth?: string;
    backgroundColor?: string;
  }) => HTMLCanvasElement;
  /** Whether prefers-reduced-motion is active. */
  reducedMotion: boolean;
};

/**
 * Shared embed frame: header + canvas region + a11y summary.
 * - `diagram` — compact schematic (pipelines).
 * - `toolbar` — balanced header + actions + canvas (caches, sorts).
 * - `terminal` — left accent rail, IDE-ish (lexer, schedulers).
 * - `article` — roomy (storage-style).
 */
export function createArticleChrome(
  options: ArticleChromeOptions,
): ArticleChrome {
  const t = resolveTheme(options.themeName ?? "dark-premium");
  const variant = options.variant ?? "article";
  const reducedMotion = prefersReducedMotion();
  // Non-security DOM ids only — prefer crypto when available (CodeQL: insecure randomness)
  const rand =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("")
      : `${Date.now().toString(36)}${performance.now().toString(36).replace(".", "")}`;
  const uid = `vislab-${(options.testId ?? "widget").replace(/\s+/g, "-")}-${rand}`;
  const titleId = `${uid}-title`;
  const summaryId = `${uid}-summary`;

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
  wrapper.style.minWidth = "0";
  wrapper.style.position = "relative";

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
  titleEl.id = titleId;
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
    box.style.flexWrap = "wrap";
    const nodes = Array.isArray(options.headerActions)
      ? options.headerActions
      : [options.headerActions];
    for (const n of nodes) {
      box.appendChild(n);
    }
    header.appendChild(box);
  }

  wrapper.appendChild(header);

  const summaryText =
    options.summary ??
    `${options.title}. Interactive canvas simulation. Surrounding prose should describe the concept for screen reader users.`;
  const summaryEl = createSrOnlySummary(summaryText);
  summaryEl.id = summaryId;
  wrapper.appendChild(summaryEl);

  const canvasWrap = document.createElement("div");
  canvasWrap.style.position = "relative";
  canvasWrap.style.backgroundColor = variant === "terminal" ? "#050505" : t.bg;
  canvasWrap.style.overflowX = "auto";

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
  if (options.minWidth) {
    canvasMount.style.minWidth = options.minWidth;
  } else if (variant === "toolbar") {
    canvasMount.style.minWidth = "320px";
  }

  canvasWrap.appendChild(canvasMount);
  wrapper.appendChild(canvasWrap);

  const setSummary = (text: string) => {
    summaryEl.textContent = text;
  };

  const a11yOpts = {
    label: options.title,
    labelledBy: titleId,
    descriptionId: summaryId,
  };

  // Auto-decorate any canvas appended into canvasMount (sync — works in happy-dom tests)
  const nativeAppend = canvasMount.appendChild.bind(canvasMount);
  canvasMount.appendChild = (<T extends Node>(node: T): T => {
    const result = nativeAppend(node);
    if (node instanceof HTMLCanvasElement) {
      decorateCanvasA11y(node, a11yOpts);
    } else if (node instanceof HTMLElement) {
      node
        .querySelectorAll("canvas")
        .forEach((c) => decorateCanvasA11y(c, a11yOpts));
    }
    return result;
  }) as typeof canvasMount.appendChild;

  if (typeof MutationObserver !== "undefined") {
    const obs = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (node instanceof HTMLCanvasElement) {
            decorateCanvasA11y(node, a11yOpts);
          } else if (node instanceof HTMLElement) {
            node
              .querySelectorAll("canvas")
              .forEach((c) => decorateCanvasA11y(c, a11yOpts));
          }
        });
      }
    });
    obs.observe(canvasMount, { childList: true, subtree: true });
  }

  const prepareCanvas = (opts?: {
    height?: string;
    minWidth?: string;
    backgroundColor?: string;
  }): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    const h = opts?.height ?? canvasH;
    canvas.style.width = "100%";
    canvas.style.height = h;
    canvas.style.display = "block";
    canvas.style.backgroundColor = opts?.backgroundColor ?? t.bg;
    if (opts?.minWidth) canvas.style.minWidth = opts.minWidth;
    decorateCanvasA11y(canvas, a11yOpts);
    canvasMount.appendChild(canvas);
    return canvas;
  };

  return {
    wrapper,
    header,
    canvasMount,
    theme: t,
    titleId,
    summaryId,
    setSummary,
    prepareCanvas,
    reducedMotion,
  };
}
