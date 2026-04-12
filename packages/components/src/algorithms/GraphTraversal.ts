import { Scene, AnimatedRect, Arrow, themes } from '@vislab/core';

export class GraphTraversal {
  private scene: Scene;
  private container: HTMLElement;
  private nodes: AnimatedRect[] = [];

  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement('div');
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '300px';
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // Simple Graph
    const positions = [
        { id: 'A', x: 300, y: 50 },
        { id: 'B', x: 200, y: 150 },
        { id: 'C', x: 400, y: 150 },
        { id: 'D', x: 150, y: 250 },
        { id: 'E', x: 300, y: 250 }
    ];

    for (let p of positions) {
        const r = new AnimatedRect(p.id, p.x, p.y, 40, 40);
        r.label = p.id;
        r.strokeColor = themes['dark-terminal'].accent1;
        this.nodes.push(r);
        this.scene.addEntity(r);
    }

    this.scene.addEntity(new Arrow('e1', 320, 90, 220, 150)); // A->B
    this.scene.addEntity(new Arrow('e2', 320, 90, 420, 150)); // A->C
    this.scene.addEntity(new Arrow('e3', 220, 190, 170, 250)); // B->D
    this.scene.addEntity(new Arrow('e4', 220, 190, 320, 250)); // B->E

    this.scene.start();
  }

  public destroy() { this.scene.stop(); }
}
