import type { Theme } from "@vislab/core";
import { AnimatedRect, Arrow, Label, Scene } from "@vislab/core";
import { createArticleChrome } from "../ui/articleChrome";
import { styleVislabButton } from "../ui/vislabButtons";

export type GraphTraversalOptions = {
  themeName?: string;
  algorithm?: "bfs" | "dfs";
};

const EDGES: [string, string][] = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "E"],
];

const POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 300, y: 40 },
  B: { x: 200, y: 130 },
  C: { x: 400, y: 130 },
  D: { x: 150, y: 220 },
  E: { x: 300, y: 220 },
};

export class GraphTraversal {
  private scene: Scene;
  private container: HTMLElement;
  private theme: Theme;
  private nodes: Map<string, AnimatedRect> = new Map();
  private algorithm: "bfs" | "dfs";
  private orderLabel: Label;
  private visitIdx = 0;

  constructor(container: HTMLElement, options?: GraphTraversalOptions) {
    this.container = container;
    this.algorithm = options?.algorithm ?? "bfs";

    const stepBtn = document.createElement("button");
    stepBtn.type = "button";
    stepBtn.textContent = "Step";
    const algoBtn = document.createElement("button");
    algoBtn.type = "button";
    algoBtn.textContent = this.algorithm.toUpperCase();

    const {
      wrapper,
      canvasMount,
      theme: t,
    } = createArticleChrome({
      title: `Graph — ${this.algorithm.toUpperCase()} traversal`,
      variant: "diagram",
      canvasHeight: "280px",
      testId: "graph-traversal",
      themeName: options?.themeName,
      headerActions: [stepBtn, algoBtn],
    });
    this.theme = t;
    styleVislabButton(stepBtn, t, "primary");
    styleVislabButton(algoBtn, t, "ghost");

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "280px";
    canvas.style.display = "block";
    canvas.style.backgroundColor = t.bg;
    canvasMount.appendChild(canvas);
    this.container.appendChild(wrapper);
    this.scene = new Scene(canvas);

    for (const [id, p] of Object.entries(POSITIONS)) {
      const r = new AnimatedRect(id, p.x, p.y, 44, 44);
      r.label = id;
      r.strokeColor = t.accent1;
      r.fillColor = t.surface;
      r.labelColor = t.fg;
      r.labelFontPx = 13;
      this.nodes.set(id, r);
      this.scene.addEntity(r);
    }

    for (const [a, b] of EDGES) {
      const pa = POSITIONS[a];
      const pb = POSITIONS[b];
      const arr = new Arrow(
        `e-${a}-${b}`,
        pa.x + 22,
        pa.y + 44,
        pb.x + 22,
        pb.y,
      );
      arr.color = t.fg;
      this.scene.addEntity(arr);
    }

    this.orderLabel = new Label("ord", "Order: —", 12, 268);
    this.orderLabel.color = t.fg;
    this.orderLabel.font = '10px "JetBrains Mono", monospace';
    this.orderLabel.align = "left";
    this.scene.addEntity(this.orderLabel);

    const visitOrder =
      this.algorithm === "bfs"
        ? ["A", "B", "C", "D", "E"]
        : ["A", "B", "D", "E", "C"];
    let step = 0;
    const visited: string[] = [];

    stepBtn.addEventListener("click", () => {
      if (step >= visitOrder.length) return;
      const id = visitOrder[step++];
      const n = this.nodes.get(id);
      if (n) {
        n.fillColor = t.accent2;
        visited.push(id);
        this.orderLabel.text = `Order: ${visited.join(" → ")}`;
      }
    });

    algoBtn.addEventListener("click", () => {
      this.algorithm = this.algorithm === "bfs" ? "dfs" : "bfs";
      algoBtn.textContent = this.algorithm.toUpperCase();
      step = 0;
      visited.length = 0;
      for (const n of this.nodes.values()) n.fillColor = t.surface;
      this.orderLabel.text = `Switched to ${this.algorithm.toUpperCase()} — press Step`;
    });

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
