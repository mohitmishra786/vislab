import type { Scene, Theme } from "@vislab/core";
import { styleVislabButton } from "./vislabButtons";

export type SimClockControls = {
  root: HTMLElement;
  /** Sync button labels after external pause/resume. */
  refresh: () => void;
  dispose: () => void;
};

const SPEEDS = [0.1, 1, 10] as const;

/**
 * Shared SimClock UI: Pause/Play + 0.1× / 1× / 10× speed buttons.
 * Space toggles pause when focus is within the widget wrapper.
 */
export function createSimClockControls(
  scene: Scene,
  theme: Theme,
  options?: {
    /** Called when pause state changes */
    onPauseChange?: (paused: boolean) => void;
    /** Element to bind Space key (usually widget wrapper) */
    keyboardRoot?: HTMLElement;
    /** Start paused (e.g. prefers-reduced-motion) */
    startPaused?: boolean;
  },
): SimClockControls {
  const root = document.createElement("div");
  root.setAttribute("data-vislab-simclock", "true");
  root.style.display = "flex";
  root.style.gap = "6px";
  root.style.alignItems = "center";
  root.style.flexWrap = "wrap";

  const pauseBtn = document.createElement("button");
  pauseBtn.type = "button";
  styleVislabButton(pauseBtn, theme, "primary", "Pause or resume simulation");

  const speedButtons: HTMLButtonElement[] = [];
  for (const s of SPEEDS) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${s}×`;
    b.dataset.speed = String(s);
    styleVislabButton(b, theme, "ghost", `Set simulation speed to ${s}x`);
    speedButtons.push(b);
  }

  let paused = Boolean(options?.startPaused);
  if (paused) {
    scene.clock.pause();
  } else {
    scene.clock.resume();
  }

  const refresh = () => {
    pauseBtn.textContent = paused ? "Play" : "Pause";
    pauseBtn.setAttribute(
      "aria-label",
      paused ? "Resume simulation" : "Pause simulation",
    );
    for (const b of speedButtons) {
      const sp = Number(b.dataset.speed);
      const active = Math.abs(scene.clock.speed - sp) < 0.001;
      b.style.outline = active ? `2px solid ${theme.accent1}` : "none";
      b.setAttribute("aria-pressed", active ? "true" : "false");
    }
  };

  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    if (paused) scene.clock.pause();
    else scene.clock.resume();
    options?.onPauseChange?.(paused);
    refresh();
  });

  for (const b of speedButtons) {
    b.addEventListener("click", () => {
      const sp = Number(b.dataset.speed);
      scene.clock.speed = sp;
      refresh();
    });
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.code !== "Space" && e.key !== " ") return;
    const t = e.target as HTMLElement | null;
    if (
      t &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
    ) {
      return;
    }
    e.preventDefault();
    pauseBtn.click();
  };

  const kb = options?.keyboardRoot;
  if (kb) {
    kb.tabIndex = kb.tabIndex >= 0 ? kb.tabIndex : 0;
    kb.addEventListener("keydown", onKey);
  }

  root.append(pauseBtn, ...speedButtons);
  refresh();

  return {
    root,
    refresh,
    dispose: () => {
      kb?.removeEventListener("keydown", onKey);
    },
  };
}
