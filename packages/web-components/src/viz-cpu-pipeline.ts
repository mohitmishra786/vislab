import { CpuPipeline } from '@vislab/components';

class VizCpuPipeline extends HTMLElement {
  private widget: CpuPipeline | null = null;

  connectedCallback() {
    this.style.display = 'block'; // Make custom elements block level by default
    const stagesProp = this.getAttribute('stages');
    const stages = stagesProp ? stagesProp.split(',') : undefined;
    
    this.widget = new CpuPipeline(this, stages);
  }

  disconnectedCallback() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }
}

if (!customElements.get('viz-cpu-pipeline')) {
  customElements.define('viz-cpu-pipeline', VizCpuPipeline);
}
