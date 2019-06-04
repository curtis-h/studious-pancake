import Canvas from "./canvas";

export default abstract class Scene {
  private readonly fps = 30;
  private readonly frameInterval = 1000 / this.fps;
  protected startTime  = 0;
  protected lastRender = 0;

  constructor(protected readonly canvas: Canvas) {}

  start() {
    this.startTime = Date.now();
    this.animate();
  }

  private animate = () => {
    window.requestAnimationFrame(this.animate);

    const now = Date.now();
    const elapsed = now - this.lastRender;

    if(elapsed > this.frameInterval) {
      this.lastRender = now - (elapsed % this.frameInterval);
      this.render(this.lastRender);
    }
  }

  protected abstract render(time: number): void;
}
