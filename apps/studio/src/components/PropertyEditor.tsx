import React from 'react';

export default function PropertyEditor() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400">Component ID</label>
        <input 
          type="text" 
          value="demo-storage-1" 
          disabled
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400">Theme Overlay</label>
        <select className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 w-full">
           <option>Dark Premium</option>
           <option>Light Academic</option>
           <option>Terminal Hacker</option>
        </select>
      </div>
      
      <div className="border-t border-slate-800 my-2 pt-4 flex flex-col gap-3">
         <h3 className="text-xs font-semibold text-blue-400">Storage Props</h3>
         
         <label className="flex items-center gap-2 text-sm text-slate-300">
           <input type="checkbox" className="rounded border-slate-700 bg-slate-800" defaultChecked />
           Show Latency Labels
         </label>

         <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-400">Timeline Bound (ms)</span>
            <input type="number" defaultValue={5000} className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm" />
         </div>
      </div>
    </div>
  );
}
