import {
  autoMountVislabOnDomReady,
  mountDataVislabRoots,
} from "@vislab/registry";
import {
  defineLegacyVislabTags,
  defineVislabCustomElements,
  defineVislabWidgetHost,
} from "./define-elements";

/**
 * Register all custom elements and auto-mount `[data-vislab]` roots (Jekyll-friendly).
 */
export function initVislabEmbeds(): void {
  defineVislabCustomElements();
  defineVislabWidgetHost();
  defineLegacyVislabTags();
  autoMountVislabOnDomReady();
}

export {
  autoMountVislabOnDomReady,
  mountDataVislabRoots,
  defineVislabCustomElements,
  defineVislabWidgetHost,
  defineLegacyVislabTags,
};

const VisLabEmbeds = {
  initVislabEmbeds,
  mountDataVislabRoots,
  autoMountVislabOnDomReady,
  defineVislabCustomElements,
  defineVislabWidgetHost,
  defineLegacyVislabTags,
};

export default VisLabEmbeds;

if (typeof window !== "undefined") {
  initVislabEmbeds();
}
