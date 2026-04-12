import React, { useEffect, useRef } from 'react';
import { StorageComparison as VanillaStorageComparison } from '@vislab/components';

export interface StorageComparisonProps {
  className?: string;
}

export const StorageComparison: React.FC<StorageComparisonProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<VanillaStorageComparison | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    widgetRef.current = new VanillaStorageComparison(containerRef.current);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};
