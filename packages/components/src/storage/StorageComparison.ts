import { AnimatedRect, Scene, themes } from "@vislab/core";

export class StorageComparison {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const t = themes["dark-premium"];

    // Header logic stripped down to pure minimalist layout
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vislab-widget", "storage-comparison");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.fontFamily = t.font;
    wrapper.style.backgroundColor = t.bg;
    wrapper.style.color = t.fg;
    // Remove heavy shadows/borders. Just a 1px border.
    wrapper.style.border = `1px solid ${t.border}`;

    // Layout configuration
    const header = document.createElement("div");
    header.style.padding = "20px 24px";
    header.style.borderBottom = `1px solid ${t.border}`;
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const title = document.createElement("h3");
    title.textContent = "IO devices and latency";
    title.style.margin = "0";
    title.style.fontSize = "16px";
    title.style.fontWeight = "normal";

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "20px";
    controls.style.alignItems = "center";

    const timeIOBtn = document.createElement("button");
    timeIOBtn.textContent = "Trigger I/O";
    timeIOBtn.style.padding = "6px 12px";
    timeIOBtn.style.cursor = "pointer";
    timeIOBtn.style.backgroundColor = "transparent";
    timeIOBtn.style.color = "#fff";
    timeIOBtn.style.fontSize = "14px";
    timeIOBtn.style.border = `1px solid ${t.border}`;
    timeIOBtn.style.fontFamily = t.font;

    controls.appendChild(timeIOBtn);
    header.appendChild(title);
    header.appendChild(controls);
    wrapper.appendChild(header);

    // Canvas Container
    const canvasWrap = document.createElement("div");
    canvasWrap.setAttribute("data-vislab-canvas", "");
    canvasWrap.style.padding = "40px";
    canvasWrap.style.position = "relative";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "400px";
    canvas.style.display = "block";

    canvasWrap.appendChild(canvas);
    wrapper.appendChild(canvasWrap);
    this.container.appendChild(wrapper);

    // Context Setup
    this.scene = new Scene(canvas);

    // Draw the static architecture
    // 1. Massive CPU block on the left
    const cpuBlock = new AnimatedRect("cpu", 50, 50, 150, 300);
    cpuBlock.fillColor = t.surface;
    cpuBlock.label = "CPU";
    cpuBlock.labelColor = "#111"; // dark text on grey

    // We adjust Font to be a bit bigger for CPU
    const originalDraw = cpuBlock.draw.bind(cpuBlock);
    cpuBlock.draw = (ctx) => {
      ctx.save();
      ctx.fillStyle = cpuBlock.fillColor;
      ctx.fillRect(cpuBlock.x, cpuBlock.y, cpuBlock.width, cpuBlock.height);
      ctx.fillStyle = cpuBlock.labelColor;
      ctx.font = '24px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        cpuBlock.label,
        cpuBlock.x + cpuBlock.width / 2,
        cpuBlock.y + cpuBlock.height / 2,
      );
      ctx.restore();
    };
    this.scene.addEntity(cpuBlock);

    // 2. Storage tiers stacked on the right
    const devices = [
      {
        id: "l1",
        name: "L1 Cache",
        latText: "(~1ns)",
        speedMs: 250,
        color: t.accent2,
      },
      {
        id: "nvme",
        name: "Local NVMe",
        latText: "(~20µs)",
        speedMs: 800,
        color: t.accent1,
      },
      {
        id: "sata",
        name: "SATA SSD",
        latText: "(~1ms)",
        speedMs: 2500,
        color: t.accent4,
      },
      {
        id: "hdd",
        name: "HDD",
        latText: "(~10ms)",
        speedMs: 6000,
        color: t.accent3,
      },
    ];

    const cpuRightEdge = 50 + 150; // CPU x + width
    const targetX = cpuRightEdge + 280; // Distance to storage targets
    const tokenWidth = 30;
    let startY = 80;

    const cards: AnimatedRect[] = [];

    for (const dev of devices) {
      // Storage Block - Smaller width to prevent cutoff
      const card = new AnimatedRect(dev.id, targetX, startY, 200, 45);
      card.fillColor = t.surface;
      card.label = `${dev.name} ${dev.latText}`;
      card.labelColor = "#111";
      card.labelAlign = "center";
      this.scene.addEntity(card);
      cards.push(card);

      startY += 65;
    }

    // Trigger Animation Race (Continuous for 30 seconds)
    let isRacing = false;
    const LOOP_DURATION = 30000; // 30 seconds

    const runTokenCycle = (token: AnimatedRect, dev: any, endTime: number) => {
      const distance = targetX - cpuRightEdge - tokenWidth;
      const velocity = distance / dev.speedMs;

      // Phase 1: Move to target (touching the left edge)
      token.moveTo(targetX - tokenWidth, tokenStartYs[dev.index], velocity);

      // Schedule arrival at target
      this.scene.scheduler.schedule({
        id: `reach-${token.id}-${this.scene.clock.simTime}`,
        triggerTime: this.scene.clock.simTime + dev.speedMs,
        execute: () => {
          token.x = targetX - tokenWidth;
          // Phase 2: Move back to CPU (touching the right edge)
          token.moveTo(cpuRightEdge, tokenStartYs[dev.index], velocity);

          // Schedule arrival back at CPU
          this.scene.scheduler.schedule({
            id: `return-${token.id}-${this.scene.clock.simTime}`,
            triggerTime: this.scene.clock.simTime + dev.speedMs,
            execute: () => {
              token.x = cpuRightEdge;
              // Check if we should continue
              if (this.scene.clock.simTime < endTime) {
                runTokenCycle(token, dev, endTime);
              } else {
                this.scene.removeEntity(token.id);
                activeTokens--;
                if (activeTokens === 0) {
                  isRacing = false;
                  timeIOBtn.disabled = false;
                  timeIOBtn.style.opacity = "1";
                }
              }
            },
          });
        },
      });
    };

    const tokenStartYs = devices.map((_, i) => 88 + i * 65);
    let activeTokens = 0;

    timeIOBtn.addEventListener("click", () => {
      if (isRacing) return;
      isRacing = true;
      timeIOBtn.disabled = true;
      timeIOBtn.style.opacity = "0.5";

      const endTime = this.scene.clock.simTime + LOOP_DURATION;
      activeTokens = devices.length;

      for (let i = 0; i < devices.length; i++) {
        const dev = { ...devices[i], index: i };
        const id = `token-${i}`;
        const token = new AnimatedRect(
          id,
          cpuRightEdge,
          tokenStartYs[i],
          tokenWidth,
          30,
        );
        token.fillColor = dev.color;
        this.scene.addEntity(token);
        runTokenCycle(token, dev, endTime);
      }
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
