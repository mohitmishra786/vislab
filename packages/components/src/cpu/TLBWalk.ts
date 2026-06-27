import { AnimatedRect, Arrow, Scene, themes } from "@vislab/core";

export class TLBWalk {
  private scene: Scene;
  private container: HTMLElement;
  private tlb: AnimatedRect;
  private pageTable: AnimatedRect[] = [];
  private arrows: Arrow[] = [];

  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = themes["dark-terminal"].font;
    wrapper.style.backgroundColor = themes["dark-terminal"].bg;
    wrapper.style.color = themes["dark-terminal"].fg;
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "15px";

    const controls = document.createElement("div");
    const walkBtn = document.createElement("button");
    walkBtn.textContent = "Trigger Page Fault / Walk";
    walkBtn.style.padding = "8px 16px";
    walkBtn.style.backgroundColor = themes["dark-terminal"].accent3;
    walkBtn.style.color = "#fff";
    walkBtn.style.border = "none";
    walkBtn.style.cursor = "pointer";

    controls.appendChild(walkBtn);
    wrapper.appendChild(controls);

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "400px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // TLB visual
    this.tlb = new AnimatedRect("tlb-core", 50, 150, 100, 80);
    this.tlb.label = "TLB (Miss)";
    this.tlb.strokeColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(this.tlb);

    // Page Table levels (4 levels typical in x86)
    const levels = ["PGD", "PUD", "PMD", "PTE"];
    for (let i = 0; i < 4; i++) {
      const rect = new AnimatedRect(
        `pt-${i}`,
        250 + i * 150,
        100 + i * 50,
        100,
        50,
      );
      rect.label = levels[i];
      rect.strokeColor = themes["dark-terminal"].accent4;
      this.pageTable.push(rect);
      this.scene.addEntity(rect);

      if (i > 0) {
        const prev = this.pageTable[i - 1];
        const arrow = new Arrow(
          `arr-${i}`,
          prev.x + prev.width,
          prev.y + prev.height / 2,
          rect.x,
          rect.y + rect.height / 2,
        );
        this.arrows.push(arrow);
        this.scene.addEntity(arrow);
      }
    }

    walkBtn.addEventListener("click", () => this.simulateWalk());

    this.scene.start();
  }

  private simulateWalk() {
    this.tlb.fillColor = themes["dark-terminal"].accent3; // Red
    this.tlb.label = "TLB MISS!";

    let currentLevel = 0;

    const walkStep = () => {
      if (currentLevel > 0) {
        this.pageTable[currentLevel - 1].fillColor = "transparent";
      }

      if (currentLevel < 4) {
        this.pageTable[currentLevel].fillColor =
          themes["dark-terminal"].accent1;
        this.scene.scheduler.schedule({
          id: `walk-${currentLevel}`,
          triggerTime: this.scene.clock.simTime + 400,
          execute: () => {
            currentLevel++;
            walkStep();
          },
        });
      } else {
        // Done walking
        this.tlb.fillColor = themes["dark-terminal"].accent2;
        this.tlb.label = "TLB HIT";
        setTimeout(() => {
          this.tlb.fillColor = "transparent";
          this.tlb.label = "TLB (Cached)";
        }, 800);
      }
    };

    this.scene.scheduler.schedule({
      id: "walk-start",
      triggerTime: this.scene.clock.simTime + 500,
      execute: walkStep,
    });
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
