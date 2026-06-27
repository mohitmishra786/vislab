import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";

export class GraphTraversal {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;

  constructor(container: HTMLElement) {
    this.container = container;

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: "Graph — BFS layout sketch",
      variant: "diagram",
      canvasHeight: "280px",
      testId: "graph-traversal",
    });
    this.theme = t;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "280px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);

    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    const positions = [
      { id: "A", x: 300, y: 40 },
      { id: "B", x: 200, y: 130 },
      { id: "C", x: 400, y: 130 },
      { id: "D", x: 150, y: 220 },
      { id: "E", x: 300, y: 220 },
    ];

    for (const p of positions) {
      const r = new AnimatedRect(p.id, p.x, p.y, 44, 44);
      r.label = p.id;
      r.strokeColor = t.accent1;
      r.fillColor = t.surface;
      r.labelColor = t.fg;
      r.labelFontPx = 13;
      this.scene.addEntity(r);
    }

    const mkArrow = (
      id: string,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => {
      const a = new Arrow(id, x1, y1, x2, y2);
      a.color = t.fg;
      a.isAnimating = false;
      return a;
    };

    this.scene.addEntity(mkArrow("e1", 322, 82, 222, 150));
    this.scene.addEntity(mkArrow("e2", 322, 82, 400, 150));
    this.scene.addEntity(mkArrow("e3", 222, 174, 172, 220));
    this.scene.addEntity(mkArrow("e4", 222, 174, 300, 220));

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
