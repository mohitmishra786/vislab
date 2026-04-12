import React from 'react';

export default function ComponentPalette() {
  const items = [
    { title: 'CPU Cache Sim', type: 'CacheSimulator' },
    { title: 'CPU Pipeline', type: 'CpuPipeline' },
    { title: 'Storage I/O', type: 'StorageComparison' },
    { title: 'Process Queue', type: 'ProcessScheduler' }
  ];

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <button 
          key={item.type}
          className="p-3 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 rounded-lg text-left transition-all hover:scale-[1.02] cursor-move"
        >
          <div className="font-medium text-slate-200">{item.title}</div>
          <div className="text-xs text-slate-500 mt-1">&lt;{item.type} /&gt;</div>
        </button>
      ))}
    </div>
  );
}
