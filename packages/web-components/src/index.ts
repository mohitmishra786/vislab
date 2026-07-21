import {
  autoMountVislabOnDomReady,
  mountDataVislabRoots,
} from "@vislab/registry";
import {
  defineLegacyVislabTags,
  defineVislabCustomElements,
  defineVislabWidgetHost,
} from "./define-elements";
import {
  autoMountVislabLazyOnDomReady,
  mountDataVislabRootsLazy,
} from "./lazy-mount";

/**
 * Register all custom elements and auto-mount `[data-vislab]` roots (Jekyll-friendly).
 * Eager path (default IIFE) loads the full catalog once.
 * For code-split ESM pages, call `initVislabEmbedsLazy()` instead (#51).
 */
export function initVislabEmbeds(): void {
  defineVislabCustomElements();
  defineVislabWidgetHost();
  defineLegacyVislabTags();
  autoMountVislabOnDomReady();
}

/** Lazy ESM path: only fetch the widget chunk(s) referenced on the page. */
export function initVislabEmbedsLazy(): void {
  defineVislabCustomElements();
  defineVislabWidgetHost();
  defineLegacyVislabTags();
  autoMountVislabLazyOnDomReady();
}

export {
  autoMountVislabOnDomReady,
  mountDataVislabRoots,
  defineVislabCustomElements,
  defineVislabWidgetHost,
  defineLegacyVislabTags,
  mountDataVislabRootsLazy,
  autoMountVislabLazyOnDomReady,
};

const VisLabEmbeds = {
  initVislabEmbeds,
  initVislabEmbedsLazy,
  mountDataVislabRoots,
  mountDataVislabRootsLazy,
  autoMountVislabOnDomReady,
  autoMountVislabLazyOnDomReady,
  defineVislabCustomElements,
  defineVislabWidgetHost,
  defineLegacyVislabTags,
};

export default VisLabEmbeds;

if (typeof window !== "undefined") {
  // Classic IIFE: full eager mount. Lazy path is opt-in via initVislabEmbedsLazy().
  initVislabEmbeds();
}
