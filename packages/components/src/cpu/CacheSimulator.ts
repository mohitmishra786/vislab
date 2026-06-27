import type { Theme } from "@vislab/core";
import { AnimatedRect, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class CacheSimulator {
  private scene: Scene;
  private container: HTMLElement;
  private memoryBlocks: AnimatedRect[] = [];
  private l1Cache: AnimatedRect[] = [];
  private l2Cache: AnimatedRect[] = [];
  private theme: Theme;

  constructor(container: HTMLElement) {
    this.container = container;

    const requestBtn = document.createElement("button");
    requestBtn.type = "button";
    requestBtn.textContent = "Random access";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Cache hierarchy",
      variant: "toolbar",
      canvasHeight: "400px",
      headerActions: requestBtn,
    });
    this.theme = t;
    styleVislabButton(requestBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.minWidth = "720px";
    canvas.style.height = "400px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.layoutArchitecture();

    requestBtn.addEventListener("click", () => {
      this.simulateMemoryAccess(Math.floor(Math.random() * 8));
    });

    this.scene.start();
  }

  private layoutArchitecture() {
    const t = this.theme;
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(`l1-${i}`, 150, 50 + i * 45, 100, 35);
      rect.label = "L1 [Empty]";
      rect.strokeColor = t.accent2;
      rect.labelFontPx = 11;
      rect.labelColor = t.fg;
      this.l1Cache.push(rect);
      this.scene.addEntity(rect);
    }

    for (let i = 0; i < 8; i++) {
      const rect = new AnimatedRect(`l2-${i}`, 350, 50 + i * 40, 120, 30);
      rect.label = "L2 [Empty]";
      rect.strokeColor = t.accent1;
      rect.labelFontPx = 11;
      rect.labelColor = t.fg;
      this.l2Cache.push(rect);
      this.scene.addEntity(rect);
    }

    for (let i = 0; i < 8; i++) {
      const rect = new AnimatedRect(`mem-${i}`, 600, 50 + i * 40, 150, 30);
      rect.label = `Add: 0x0${i}A`;
      rect.strokeColor = t.accent4;
      rect.labelFontPx = 11;
      rect.labelColor = t.fg;
      this.memoryBlocks.push(rect);
      this.scene.addEntity(rect);
    }
  }

  private simulateMemoryAccess(addressIndex: number) {
    const t = this.theme;
    const l1Index = addressIndex % 4;
    const l2Index = addressIndex;
    const l1Block = this.l1Cache[l1Index];

    if (l1Block.label === `L1 [0x0${addressIndex}A]`) {
      l1Block.fillColor = t.accent2;
      setTimeout(() => {
        l1Block.fillColor = "transparent";
      }, 500);
      return;
    }

    l1Block.fillColor = t.accent3;
    const l2Block = this.l2Cache[l2Index];

    setTimeout(() => {
      if (l2Block.label === `L2 [0x0${addressIndex}A]`) {
        l2Block.fillColor = t.accent2;
        setTimeout(() => {
          l2Block.fillColor = "transparent";
        }, 500);
      } else {
        l2Block.fillColor = t.accent3;
        this.memoryBlocks[addressIndex].fillColor = t.accent2;
        setTimeout(() => {
          this.memoryBlocks[addressIndex].fillColor = "transparent";
        }, 500);
        l2Block.label = `L2 [0x0${addressIndex}A]`;
      }
      l1Block.label = `L1 [0x0${addressIndex}A]`;
      l1Block.fillColor = "transparent";
    }, 600);
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
