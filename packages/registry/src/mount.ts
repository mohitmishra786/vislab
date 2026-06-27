import { createVislabComponent } from "./registry";

function parseProps(el: Element): Record<string, unknown> | undefined {
  const raw = el.getAttribute("data-props");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.warn("[VisLab] Invalid data-props JSON on element", el);
    return undefined;
  }
}

/**
 * Mount widgets on elements like:
 * `<div data-vislab="CpuPipeline" data-props='{"stages":["IF","ID","EX","MEM","WB"]}'></div>`
 */
export function mountDataVislabRoots(root: ParentNode = document): void {
  if (typeof document === "undefined") return;

  const nodes = root.querySelectorAll<HTMLElement>("[data-vislab]");
  nodes.forEach((el) => {
    if ((el as HTMLElement & { vislabMounted?: boolean }).vislabMounted) return;
    const name = el.getAttribute("data-vislab");
    if (!name) return;
    const props = parseProps(el);
    const widget = createVislabComponent(name, el, props);
    (
      el as HTMLElement & {
        vislabMounted?: boolean;
        vislabWidget?: { destroy(): void };
      }
    ).vislabMounted = true;
    (el as HTMLElement & { vislabWidget?: { destroy(): void } }).vislabWidget =
      widget;
  });
}

export function autoMountVislabOnDomReady(): void {
  if (typeof document === "undefined") return;
  const run = () => mountDataVislabRoots(document);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
