import {
  createVislabComponent,
  renderVislabMountError,
} from "@vislab/registry";
import type React from "react";
import { useEffect, useRef } from "react";

export type VislabMountProps = {
  /** PascalCase name as on `window.VisLab`, e.g. CpuPipeline */
  component: string;
  className?: string;
} & Record<string, unknown>;

/**
 * Generic React island: mounts any registered VisLab widget into a div.
 * Unknown component names render a visible error alert (not a blank div).
 */
export const VislabMount: React.FC<VislabMountProps> = ({
  component,
  className,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const propsKey = JSON.stringify(props ?? {});

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let widget: { destroy(): void } | null = null;
    try {
      const parsed = JSON.parse(propsKey) as Record<string, unknown>;
      widget = createVislabComponent(
        component,
        el,
        Object.keys(parsed).length ? parsed : undefined,
      );
    } catch (err) {
      // createVislabComponent paints unknown-name errors; catch other failures
      if (!el.querySelector("[data-vislab-error]")) {
        const msg =
          err instanceof Error ? err.message : `Failed to mount ${component}`;
        renderVislabMountError(el, msg);
      }
      console.error("[VisLab] VislabMount failed", component, err);
    }
    return () => {
      widget?.destroy();
    };
  }, [component, propsKey]);

  return <div ref={ref} className={className} />;
};
