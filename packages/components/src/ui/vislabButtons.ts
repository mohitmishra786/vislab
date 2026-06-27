import type { Theme } from "@vislab/core";

export type VislabButtonTone = "primary" | "secondary" | "danger" | "ghost";

/**
 * Consistent control styling for embed headers / toolbars.
 */
export function styleVislabButton(
  el: HTMLButtonElement,
  t: Theme,
  tone: VislabButtonTone = "primary",
): void {
  el.style.padding = "6px 12px";
  el.style.cursor = "pointer";
  el.style.fontFamily = t.font;
  el.style.fontSize = "12px";
  el.style.borderRadius = "4px";
  el.style.border = `1px solid ${t.border}`;

  if (tone === "primary") {
    el.style.backgroundColor = t.accent1;
    el.style.color = t.bg;
    el.style.border = "none";
  } else if (tone === "secondary") {
    el.style.backgroundColor = t.surface;
    el.style.color = t.fg;
  } else if (tone === "danger") {
    el.style.backgroundColor = t.accent3;
    el.style.color = t.bg;
    el.style.border = "none";
  } else {
    el.style.backgroundColor = "transparent";
    el.style.color = t.fg;
  }
}
