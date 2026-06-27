import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";
import type { VislabWidgetOptions } from "../types";

export class InodeTree {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private nodes: Map<string, AnimatedRect> = new Map();
  private path = ["/", "home", "data.txt"];
  private step = 0;
  private status: Label;

  constructor(container: HTMLElement, options?: VislabWidgetOptions) {
    this.container = container;

    const walkBtn = document.createElement("button");
    walkBtn.type = "button";
    walkBtn.textContent = "Resolve path";

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Inode tree — path resolution",
      variant: "terminal",
      canvasHeight: "360px",
      testId: "inode-tree",
      themeName: options?.themeName,
      headerActions: walkBtn,
    });
    this.theme = t;
    styleVislabButton(walkBtn, t, "secondary");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "360px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#050505";
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const defs = [
      { id: "root", x: 280, y: 40, label: "/ inode:2" },
      { id: "home", x: 140, y: 140, label: "home inode:5" },
      { id: "usr", x: 420, y: 140, label: "usr inode:8" },
      { id: "file", x: 140, y: 240, label: "data.txt inode:12" },
    ];
    for (const d of defs) {
      const r = new AnimatedRect(d.id, d.x, d.y, 130, 36);
      r.label = d.label;
      r.strokeColor = t.accent1;
      r.labelFontPx = 10;
      this.nodes.set(d.id, r);
      this.scene.addEntity(r);
    }

    this.scene.addEntity(new Arrow("a1", 345, 76, 205, 140));
    this.scene.addEntity(new Arrow("a2", 345, 76, 485, 140));
    this.scene.addEntity(new Arrow("a3", 205, 176, 205, 240));

    this.status = new Label("in", "/home/data.txt", 12, 340);
    this.status.color = t.accent2;
    this.status.font = '10px "JetBrains Mono", monospace';
    this.status.align = "left";
    this.scene.addEntity(this.status);

    const ids = ["root", "home", "file"];
    walkBtn.addEventListener("click", () => {
      if (this.step >= ids.length) {
        this.step = 0;
        for (const n of this.nodes.values()) n.fillColor = "transparent";
      }
      const id = ids[this.step++];
      const n = this.nodes.get(id);
      if (n) {
        n.fillColor = t.accent2;
        this.status.text = `Lookup: ${this.path.slice(0, this.step).join("") || "/"}`;
      }
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}