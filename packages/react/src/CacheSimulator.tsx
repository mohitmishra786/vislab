import React, { useEffect, useRef } from 'react';
import { CacheSimulator as VanillaCacheSimulator } from '@vislab/components';

export interface CacheSimulatorProps {
  className?: string;
}

export const CacheSimulator: React.FC<CacheSimulatorProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<VanillaCacheSimulator | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    widgetRef.current = new VanillaCacheSimulator(containerRef.current);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};
