import type { VislabWidget } from "@vislab/registry";
import { createVislabComponent, vislabRegistry } from "@vislab/registry";

function readPropsFromAttributes(
  el: HTMLElement,
): Record<string, unknown> | undefined {
  const raw = el.getAttribute("data-props");
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.warn("[VisLab] Invalid data-props on", el.tagName);
    }
  }
  const stages = el.getAttribute("stages");
  if (stages) {
    return {
      stages: stages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }
  return undefined;
}

/**
 * Register one custom element per registry entry (e.g. `<vislab-cpu-pipeline stages="IF,ID,EX,MEM,WB">`).
 */
export function defineVislabCustomElements(): void {
  if (typeof customElements === "undefined") return;

  for (const entry of vislabRegistry) {
    if (customElements.get(entry.customElementTag)) continue;

    const tag = entry.customElementTag;
    customElements.define(
      tag,
      class extends HTMLElement {
        private widget: VislabWidget | null = null;

        connectedCallback() {
          this.style.display = this.style.display || "block";
          const props = readPropsFromAttributes(this);
          this.widget = entry.create(this, props);
        }

        disconnectedCallback() {
          if (this.widget) {
            this.widget.destroy();
            this.widget = null;
          }
        }
      },
    );
  }
}

/**
 * Generic host: `<vislab-widget component="CpuPipeline" data-props='{"stages":["IF","ID"]}'></vislab-widget>`
 */
/** Backward-compatible tags used in early demos. */
const LEGACY_TAG_TO_GLOBAL: Record<string, string> = {
  "viz-cpu-pipeline": "CpuPipeline",
  "viz-cache-simulator": "CacheSimulator",
};

export function defineLegacyVislabTags(): void {
  if (typeof customElements === "undefined") return;

  for (const [tag, globalName] of Object.entries(LEGACY_TAG_TO_GLOBAL)) {
    if (customElements.get(tag)) continue;

    customElements.define(
      tag,
      class extends HTMLElement {
        private widget: VislabWidget | null = null;

        connectedCallback() {
          this.style.display = this.style.display || "block";
          const props = readPropsFromAttributes(this);
          this.widget = createVislabComponent(globalName, this, props);
        }

        disconnectedCallback() {
          this.widget?.destroy();
          this.widget = null;
        }
      },
    );
  }
}

export function defineVislabWidgetHost(): void {
  if (typeof customElements === "undefined") return;
  if (customElements.get("vislab-widget")) return;

  customElements.define(
    "vislab-widget",
    class extends HTMLElement {
      private widget: VislabWidget | null = null;

      connectedCallback() {
        const name = this.getAttribute("component");
        if (!name) {
          console.warn("[vislab-widget] missing component attribute");
          return;
        }
        this.style.display = this.style.display || "block";
        const props = readPropsFromAttributes(this);
        this.widget = createVislabComponent(name, this, props);
      }

      disconnectedCallback() {
        this.widget?.destroy();
        this.widget = null;
      }
    },
  );
}
