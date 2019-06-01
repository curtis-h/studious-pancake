export default class Canvas {
  private element: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly bounds: ClientRect;

  constructor() {
    this.element        = document.getElementById("canvas") as HTMLCanvasElement;
    this.context        = this.element.getContext("2d")!;
    this.bounds         = this.element.getBoundingClientRect();
    this.element.width  = this.bounds.width;
    this.element.height = this.bounds.height;
  }
}
