import type { Theme } from "@vislab/core";
import { AnimatedRect, Label, Scene } from "@vislab/core";
import type { VislabWidgetOptions } from "../types";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export class BTreeOps {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private root: AnimatedRect;
  private children: AnimatedRect[] = [];
  private status: Label;
  private searchKeys = [30, 50, 90];
  private step = 0;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const searchBtn = document.createElement("button");
    searchBtn.type = "button";
    searchBtn.textContent = "Search step";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "B-tree search",
      variant: "diagram",
      canvasHeight: "280px",
      testId: "btree-ops",
      themeName: options?.themeName,
      headerActions: searchBtn,
    });
    this.theme = t;
    styleVislabButton(searchBtn, t, "primary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "280px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    this.root = new AnimatedRect("r", 280, 40, 110, 40);
    this.root.label = "[ 40 | 80 ]";
    this.root.strokeColor = t.accent1;
    this.root.labelFontPx = 11;
    this.scene.addEntity(this.root);

    const childData = [
      { id: "c1", x: 100, y: 140, label: "[ 10 | 20 | 30 ]" },
      { id: "c2", x: 280, y: 140, label: "[ 50 | 60 ]" },
      { id: "c3", x: 460, y: 140, label: "[ 90 | 100 ]" },
    ];
    for (const c of childData) {
      const rect = new AnimatedRect(c.id, c.x, c.y, 120, 36);
      rect.label = c.label;
      rect.strokeColor = t.accent2;
      rect.labelFontPx = 10;
      this.children.push(rect);
      this.scene.addEntity(rect);
    }

    this.status = new Label("bt", "Traverse root → child", 12, 260);
    this.status.color = t.fg;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    searchBtn.addEventListener("click", () => this.searchStep());

    this.scene.start();
  }

  private searchStep() {
    const t = this.theme;
    const key = this.searchKeys[this.step % this.searchKeys.length];
    this.step++;
    for (const c of this.children) c.fillColor = "transparent";
    this.root.fillColor = t.accent1;
    let target = this.children[0];
    if (key >= 40 && key < 80) target = this.children[1];
    if (key >= 80) target = this.children[2];
    this.status.text = `Search ${key}: root → ${target.label}`;
    this.scene.scheduler.schedule({
      id: `bt-${key}`,
      triggerTime: this.scene.clock.simTime + 400,
      execute: () => {
        this.root.fillColor = "transparent";
        target.fillColor = t.accent2;
      },
    });
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
