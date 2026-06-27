export abstract class Entity {
  public id: string;
  public visible = true;

  constructor(id: string) {
    this.id = id;
  }

  /**
   * Update the entity's state based on simulation delta time
   * @param dt Delta time in simulation milliseconds
   */
  abstract update(dt: number): void;

  /**
   * Draw the entity to the canvas
   * @param ctx Canvas rendering context
   */
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
