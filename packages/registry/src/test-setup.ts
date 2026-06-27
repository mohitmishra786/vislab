/** happy-dom does not implement CanvasRenderingContext2D — stub for mount tests */
const stub2d = {
  setTransform: () => {},
  clearRect: () => {},
  fillRect: () => {},
  strokeRect: () => {},
  fillText: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  stroke: () => {},
  save: () => {},
  restore: () => {},
} as unknown as CanvasRenderingContext2D;

HTMLCanvasElement.prototype.getContext = ((
  contextId: string,
): CanvasRenderingContext2D | null => {
  if (contextId !== "2d") return null;
  return stub2d;
}) as typeof HTMLCanvasElement.prototype.getContext;