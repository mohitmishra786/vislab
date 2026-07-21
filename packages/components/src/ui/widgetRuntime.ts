import type { Scene, Theme } from "@vislab/core";
import {
  type SimClockControls,
  createSimClockControls,
} from "./simClockControls";
import { createStaticExportControl } from "./staticExport";

export type WidgetRuntime = {
  clock: SimClockControls;
  dispose: () => void;
};

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
    getSummary: () => string;
    onPauseChange?: (paused: boolean) => void;
    /** Override startPaused (defaults to reducedMotion). */
    startPaused?: boolean;
  },
): WidgetRuntime {
  const clock = createSimClockControls(scene, theme, {
    keyboardRoot: options.wrapper,
    startPaused: options.startPaused ?? options.reducedMotion,
    onPauseChange: options.onPauseChange,
  });
  options.clockHost.appendChild(clock.root);

  const exportCtrl = createStaticExportControl(theme, {
    canvas: options.canvas,
    title: options.title,
    getSummary: options.getSummary,
  });
  (options.exportHost ?? options.clockHost).appendChild(exportCtrl.root);

  return {
    clock,
    dispose: () => {
      clock.dispose();
      exportCtrl.dispose();
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
