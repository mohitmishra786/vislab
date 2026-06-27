import { createVislabComponent } from "@vislab/registry";
import type React from "react";
import { useEffect, useRef } from "react";

export type VislabMountProps = {
  /** PascalCase name as on `window.VisLab`, e.g. CpuPipeline */
  component: string;
  className?: string;
} & Record<string, unknown>;

/**
 * Generic React island: mounts any registered VisLab widget into a div.
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
    const parsed = JSON.parse(propsKey) as Record<string, unknown>;
    const widget = createVislabComponent(
      component,
      ref.current,
      Object.keys(parsed).length ? parsed : undefined,
    );
    return () => widget.destroy();
  }, [component, propsKey]);

  return <div ref={ref} className={className} />;
};
