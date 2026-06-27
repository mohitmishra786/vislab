import { AnimatedRect, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export type StorageComparisonOptions = {
  themeName?: string;
  speed?: number;
};

export class StorageComparison {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement, options?: StorageComparisonOptions) {
    this.container = container;

    const timeIOBtn = document.createElement("button");
    timeIOBtn.type = "button";
    timeIOBtn.textContent = "Trigger I/O";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "IO devices and latency",
      variant: "article",
      canvasHeight: "400px",
      testId: "storage-comparison",
      themeName: options?.themeName,
      headerActions: timeIOBtn,
    });

    styleVislabButton(timeIOBtn, t, "ghost");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "400px";
    canvas.style.display = "block";
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const cpuBlock = new AnimatedRect("cpu", 50, 50, 150, 300);
    cpuBlock.fillColor = t.surface;
    cpuBlock.label = "CPU";
    cpuBlock.labelColor = "#111";
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

    const cpuRightEdge = 200;
    const targetX = cpuRightEdge + 280;
    const tokenWidth = 30;
    let startY = 80;
    const tokenStartYs = devices.map((_, i) => 88 + i * 65);

    for (const dev of devices) {
      const card = new AnimatedRect(dev.id, targetX, startY, 200, 45);
      card.fillColor = t.surface;
      card.label = `${dev.name} ${dev.latText}`;
      card.labelColor = "#111";
      card.labelAlign = "center";
      this.scene.addEntity(card);
      startY += 65;
    }

    let isRacing = false;
    const LOOP_DURATION = 30000;
    let activeTokens = 0;

    const runTokenCycle = (
      token: AnimatedRect,
      dev: (typeof devices)[0] & { index: number },
      endTime: number,
    ) => {
      const distance = targetX - cpuRightEdge - tokenWidth;
      const velocity = distance / dev.speedMs;
      token.moveTo(targetX - tokenWidth, tokenStartYs[dev.index], velocity);
      this.scene.scheduler.schedule({
        id: `reach-${token.id}-${this.scene.clock.simTime}`,
        triggerTime: this.scene.clock.simTime + dev.speedMs,
        execute: () => {
          token.x = targetX - tokenWidth;
          token.moveTo(cpuRightEdge, tokenStartYs[dev.index], velocity);
          this.scene.scheduler.schedule({
            id: `return-${token.id}-${this.scene.clock.simTime}`,
            triggerTime: this.scene.clock.simTime + dev.speedMs,
            execute: () => {
              token.x = cpuRightEdge;
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

    timeIOBtn.addEventListener("click", () => {
      if (isRacing) return;
      isRacing = true;
      timeIOBtn.disabled = true;
      timeIOBtn.style.opacity = "0.5";
      const endTime = this.scene.clock.simTime + LOOP_DURATION;
      activeTokens = devices.length;
      for (let i = 0; i < devices.length; i++) {
        const dev = { ...devices[i], index: i };
        const token = new AnimatedRect(
          `token-${i}`,
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

    if (options?.speed) {
      this.scene.clock.speed = Math.max(0.1, Math.min(10, options.speed));
    }
    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}