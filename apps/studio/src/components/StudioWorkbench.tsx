import { VislabMount } from "@vislab/react";
import type { VislabComponentEntry } from "@vislab/registry";
import { vislabRegistry } from "@vislab/registry";
import React, { useCallback, useMemo, useState } from "react";

function buildMdxSnippet(
  entry: VislabComponentEntry,
  props: Record<string, unknown>,
): string {
  const propsParts = Object.entries(props).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  const jsxProps =
    propsParts.length > 0
      ? " " +
        propsParts
          .map(([k, v]) => {
            if (typeof v === "string")
              return `${k}="${v.replace(/"/g, '\\"')}"`;
            return `${k}={${JSON.stringify(v)}}`;
          })
          .join(" ")
      : "";
  return `import { ${entry.globalName} } from '@vislab/react';

<${entry.globalName} client:visible${jsxProps} />
`;
}

export default function StudioWorkbench() {
  const [selectedId, setSelectedId] = useState(vislabRegistry[0]?.id ?? "");
  const [stagesText, setStagesText] = useState("IF,ID,EX,MEM,WB");
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const entry = useMemo(
    () => vislabRegistry.find((e) => e.id === selectedId),
    [selectedId],
  );

  const previewProps = useMemo(() => {
    if (!entry) return {};
    if (entry.globalName === "CpuPipeline") {
      const stages = stagesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return stages.length ? { stages } : {};
    }
    return {};
  }, [entry, stagesText]);

  const handleExport = useCallback(async () => {
    if (!entry) return;
    const mdx = buildMdxSnippet(entry, previewProps);
    try {
      await navigator.clipboard.writeText(mdx);
      setExportMsg("Copied MDX to clipboard");
      setTimeout(() => setExportMsg(null), 2500);
    } catch {
      setExportMsg("Copy failed — select text manually");
    }
  }, [entry, previewProps]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900 shadow-xl z-10 shrink-0">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Components
        </h2>
        <div className="flex flex-col gap-2">
          {vislabRegistry.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelectedId(e.id)}
              className={`p-3 rounded-lg text-left transition-all border ${
                e.id === selectedId
                  ? "bg-slate-800 border-blue-500/50 ring-1 ring-blue-500/30"
                  : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/80"
              }`}
            >
              <div className="font-medium text-slate-200">{e.displayName}</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                {e.globalName}
              </div>
              <div className="text-[10px] uppercase text-slate-600 mt-1">
                {e.category}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 p-8 overflow-y-auto bg-[#0a0f1c] flex flex-col relative items-center justify-start">
        <div className="absolute inset-0 pattern-dots text-slate-800 opacity-50 z-0 pointer-events-none" />
        <div className="z-10 w-full max-w-4xl shadow-2xl ring-1 ring-slate-800/50 rounded-xl overflow-hidden bg-slate-900 min-h-[400px]">
          {entry ? (
            <VislabMount
              key={entry.id + stagesText}
              component={entry.globalName}
              {...previewProps}
            />
          ) : (
            <div className="p-8 text-slate-500">Select a component</div>
          )}
        </div>
      </section>

      <aside className="w-80 border-l border-slate-800 p-4 overflow-y-auto bg-slate-900 shadow-xl z-10 shrink-0">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Properties
        </h2>
        {entry?.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            {entry.description}
          </p>
        )}
        {entry?.globalName === "CpuPipeline" && (
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-slate-400">
              Stages (comma-separated)
            </label>
            <input
              type="text"
              value={stagesText}
              onChange={(e) => setStagesText(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 font-mono"
            />
          </div>
        )}
        <div className="text-xs font-mono text-slate-500 break-all">
          &lt;{entry?.customElementTag} /&gt;
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Copy MDX snippet
        </button>
        {exportMsg && (
          <p className="mt-2 text-xs text-emerald-400">{exportMsg}</p>
        )}
      </aside>
    </div>
  );
}
