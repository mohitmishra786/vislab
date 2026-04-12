import { CacheSimulator } from '@vislab/components';

class VizCacheSimulator extends HTMLElement {
  private widget: CacheSimulator | null = null;

  connectedCallback() {
    this.style.display = 'block';
    this.widget = new CacheSimulator(this);
  }

  disconnectedCallback() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }
}

if (!customElements.get('viz-cache-simulator')) {
  customElements.define('viz-cache-simulator', VizCacheSimulator);
}
