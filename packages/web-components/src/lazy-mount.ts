import {
  createVislabComponentAsync,
  renderVislabMountError,
} from "@vislab/registry";

/**
 * Lazy-mount `[data-vislab]` nodes by dynamically importing only the
 * requested widget ESM chunk (plus shared core). Use with a modern bundler
 * or import maps; the classic IIFE still mounts eagerly via define-elements.
 *
 * Mark roots with `data-vislab-lazy="true"` (or omit to default lazy when
 * `data-vislab-mode="lazy"` is on documentElement).
 */
export async function mountDataVislabRootsLazy(
  root: ParentNode = document,
): Promise<void> {
  if (typeof document === "undefined") return;

  const nodes = root.querySelectorAll<HTMLElement>("[data-vislab]");
  await Promise.all(
    Array.from(nodes).map(async (el) => {
      const host = el as HTMLElement & {
        vislabMounted?: boolean;
        vislabWidget?: { destroy(): void };
      };
      if (host.vislabMounted) return;

      const name = el.getAttribute("data-vislab");
      if (!name) {
        renderVislabMountError(
          el,
          '[VisLab] data-vislab attribute is empty. Set e.g. data-vislab="CpuPipeline".',
        );
        return;
      }

      let props: Record<string, unknown> | undefined;
      const raw = el.getAttribute("data-props");
      if (raw) {
        try {
          props = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          console.warn("[VisLab] Invalid data-props JSON on element", el);
        }
      }

      try {
        const widget = await createVislabComponentAsync(name, el, props);
        host.vislabMounted = true;
        host.vislabWidget = widget;
      } catch (err) {
        console.error("[VisLab] lazy mount failed for", name, err);
        host.vislabMounted = true;
      }
    }),
  );
}

export function autoMountVislabLazyOnDomReady(): void {
  if (typeof document === "undefined") return;
  const run = () => {
    void mountDataVislabRootsLazy(document);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
