import type { Scene, Theme } from "@vislab/core";
import {
  type SimClockControls,
  createSimClockControls,
} from "./simClockControls";
import { createStaticExportControl } from "./staticExport";

export type LiveSummary = {
  /** Current summary text (also used by Static SVG export). */
  get: () => string;
  /** Update SR/crawlable summary + internal export text. */
  set: (text: string) => void;
};

export type WidgetRuntime = {
  clock: SimClockControls;
  summary: LiveSummary;
  dispose: () => void;
};

/**
 * Live summary helper: keeps chrome SR text and export payload in sync.
 */
export function createLiveSummary(
  setChromeSummary: (text: string) => void,
  initial: string,
): LiveSummary {
  let current = initial;
  setChromeSummary(initial);
  return {
    get: () => current,
    set: (text: string) => {
      current = text;
      setChromeSummary(text);
    },
  };
}

/**
 * Attach SimClock + optional static a11y export to a widget.
 * Call after `new Scene(canvas)` and before `scene.start()`.
 */
export function attachWidgetRuntime(
  scene: Scene,
  theme: Theme,
  options: {
    wrapper: HTMLElement;
    clockHost: HTMLElement;
    /** Prefer true when prefers-reduced-motion is set. */
    reducedMotion: boolean;
    /** Extra host for export button (defaults to clockHost). */
    exportHost?: HTMLElement;
    canvas: HTMLCanvasElement;
    title: string;
    /**
     * Live summary controller. Prefer createLiveSummary(setSummary, initial).
     * Falls back to getSummary if provided without summary.
     */
    summary?: LiveSummary;
    getSummary?: () => string;
    onPauseChange?: (paused: boolean) => void;
    /** Override startPaused (defaults to reducedMotion). */
    startPaused?: boolean;
    /**
     * Show Static SVG export control. Default true.
     * Set false for pure step-through widgets where export clutters the toolbar.
     */
    showStaticExport?: boolean;
  },
): WidgetRuntime {
  const summary: LiveSummary =
    options.summary ??
    (() => {
      let t =
        options.getSummary?.() ??
        `${options.title}. Interactive canvas simulation.`;
      return {
        get: () => t,
        set: (text: string) => {
          t = text;
        },
      };
    })();

  const clock = createSimClockControls(scene, theme, {
    keyboardRoot: options.wrapper,
    startPaused: options.startPaused ?? options.reducedMotion,
    onPauseChange: options.onPauseChange,
  });
  options.clockHost.appendChild(clock.root);

  let exportDispose = () => {};
  if (options.showStaticExport !== false) {
    const exportCtrl = createStaticExportControl(theme, {
      canvas: options.canvas,
      title: options.title,
      getSummary: () => summary.get(),
    });
    (options.exportHost ?? options.clockHost).appendChild(exportCtrl.root);
    exportDispose = exportCtrl.dispose;
  }

  return {
    clock,
    summary,
    dispose: () => {
      clock.dispose();
      exportDispose();
    },
  };
}

/** Empty host div for clock strip in chrome headerActions. */
export function createClockHost(): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute("data-vislab-clock-host", "true");
  el.style.display = "contents";
  return el;
}
