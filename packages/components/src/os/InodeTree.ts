import { AnimatedRect, Arrow, Scene, themes } from "@vislab/core";

export class InodeTree {
  private scene: Scene;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = themes["dark-terminal"].font;
    wrapper.style.backgroundColor = themes["dark-terminal"].bg;
    wrapper.style.color = themes["dark-terminal"].fg;
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "8px";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "400px";
    wrapper.appendChild(canvas);
    this.container.appendChild(wrapper);

    this.scene = new Scene(canvas);

    // Simplified Tree Visual
    const root = new AnimatedRect("root", 300, 50, 100, 40);
    root.label = "/ (inode: 2)";
    root.strokeColor = themes["dark-terminal"].accent1;
    this.scene.addEntity(root);

    const home = new AnimatedRect("home", 150, 150, 120, 40);
    home.label = "home/ (inode: 5)";
    this.scene.addEntity(home);

    const usr = new AnimatedRect("usr", 450, 150, 120, 40);
    usr.label = "usr/ (inode: 8)";
    this.scene.addEntity(usr);

    const file = new AnimatedRect("file", 150, 250, 140, 40);
    file.label = "data.txt (inode: 12)";
    file.fillColor = themes["dark-terminal"].accent2;
    this.scene.addEntity(file);

    this.scene.addEntity(new Arrow("a1", 350, 90, 210, 150));
    this.scene.addEntity(new Arrow("a2", 350, 90, 510, 150));
    this.scene.addEntity(new Arrow("a3", 210, 190, 210, 250));

    this.scene.start();
  }

  public destroy() {
    this.scene.dispose();
    this.container.innerHTML = "";
  }
}
