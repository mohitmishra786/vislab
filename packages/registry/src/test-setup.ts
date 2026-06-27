/** happy-dom does not implement CanvasRenderingContext2D — stub for mount tests */
HTMLCanvasElement.prototype.getContext = function getContext(type: string) {
  if (type !== "2d") return null;
  return {
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
};
