import React, { useEffect, useRef } from 'react';
import { CpuPipeline as VanillaCpuPipeline } from '@vislab/components';

export interface CpuPipelineProps {
  className?: string;
  stages?: string[];
}

export const CpuPipeline: React.FC<CpuPipelineProps> = ({ className, stages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<VanillaCpuPipeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate vanilla component inside the ref container
    widgetRef.current = new VanillaCpuPipeline(containerRef.current, stages);

    return () => {
      // Cleanup on unmount
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, [stages]);

  return <div ref={containerRef} className={className} />;
};
