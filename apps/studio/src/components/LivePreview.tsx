import React from 'react';
import { StorageComparison } from '@vislab/react';

export default function LivePreview() {
  return (
    <div className="bg-slate-900 w-full min-h-[400px]">
       {/* Mock active selection in the studio */}
       <StorageComparison />
    </div>
  );
}
