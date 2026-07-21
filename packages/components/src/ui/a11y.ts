/**
 * Accessibility helpers for canvas widgets.
 */

/** True when the user prefers reduced motion (autoplay should pause). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Visually hidden but available to screen readers / crawlers.
 */
export function createSrOnlySummary(initialText: string): HTMLElement {
  const el = document.createElement("p");
  el.setAttribute("data-vislab-summary", "true");
  el.textContent = initialText;
  el.style.position = "absolute";
  el.style.width = "1px";
  el.style.height = "1px";
  el.style.padding = "0";
  el.style.margin = "-1px";
  el.style.overflow = "hidden";
  el.style.clip = "rect(0, 0, 0, 0)";
  el.style.whiteSpace = "nowrap";
  el.style.border = "0";
  return el;
}

/**
 * Apply ARIA roles so the canvas has an accessible name.
 * Content of the bitmap remains visual-only; pair with a text summary.
 */
export function decorateCanvasA11y(
  canvas: HTMLCanvasElement,
  opts: { label: string; labelledBy?: string; descriptionId?: string },
): void {
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", opts.label);
  if (opts.labelledBy) {
    canvas.setAttribute("aria-labelledby", opts.labelledBy);
  }
  if (opts.descriptionId) {
    canvas.setAttribute("aria-describedby", opts.descriptionId);
  }
}
