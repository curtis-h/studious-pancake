import Scene from "../scene";

export default class SierpinskiScene extends Scene {
  private time: number = 0;

  protected render(time: number) {
    const bounds = this.canvas.bounds;
    this.time = time;

    this.canvas.context.clearRect(0, 0, bounds.width, bounds.height);
    this.canvas.context.strokeStyle = "rgba(255, 255, 255)";
    this.canvas.context.beginPath();
    // this.fractalLine(bounds.width / 2, bounds.height / 1.5, 0, 1);
    this.trefoilKnot();
  }

  private fractalLine(x: number, y: number, angle: number, iteration: number) {
    if(iteration > 13) return;

    const ctx    = this.canvas.context;
    const length = 200 / iteration;
    const radian = 0 - Math.PI / 2 + angle * Math.PI / 180;
    const cx     = x + (length * Math.cos(radian));
    const cy     = y + (length * Math.sin(radian));

    ctx.moveTo(x, y);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    const adjust = 360 * Math.sin(this.time * 0.00005);

    this.fractalLine(cx, cy, angle - adjust, iteration + 1);
    this.fractalLine(cx, cy, angle + adjust, iteration + 1);
  }

  private trefoilKnot() {
    const bounds = this.canvas.bounds;
    const x = this.canvas.context;
    const t = this.time * 0.00005;
    const S = Math.sin;
    const C = Math.cos;

    const w = bounds.width / 2;
    const a = 2//(2 * S(this.time * 0.000001));
    const b = 2//(3 * S(this.time * 0.000002));
    const c = (18 * S(this.time * 0.000001));
    const d = 3;

    // let f;
    let z;
    let i=0;
    let width = bounds.width;
    const f = (g: any, i: number) => a * g(b * i / c) + g(-i / d);

    for(i = width; i > 0; i--) {
      z = 7//7 + f(S, i) * S(t) - S(i) * C(t);
      // const arcX = w + w * (S(t) + f(S, i) * C(t)) / z;
      const arcX = w + w * (f(S, i)) / z;
      const arcY = 540 + w * f(C, i) / z
      const radius = w / z / z;
      x.arc(arcX, arcY, radius, 0, 2 * Math.PI);
    }
    x.stroke();
  }
}
