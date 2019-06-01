import Canvas from "./canvas";

export default class Terrain {
  private readonly size: number;
  private readonly max: number;
  private readonly map: Float32Array;

  constructor(private readonly canvas: Canvas) {
    this.size = Math.pow(2, 9) + 1;
    console.log("SIZE: ", this.size);
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
  }

  public start() {
    this.generate(0.7);
    this.render();
  }

  private get(x: number, y: number) {
    return (x < 0 || x > this.max || y < 0 || y > this.max)
      ? -1
      : this.map[x + this.size * y];
  }

  private set(x: number, y: number, val: number) {
    this.map[x + this.size * y] = val;
  }

  private generate(roughness: number) {
    this.set(0, 0, this.max);
    this.set(this.max, 0, this.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, this.max / 2);

    this.divide(this.max);
  }

  private divide(size: number): void {
    const half = size / 2;
    const scale = 0.7 * size;

    if(half < 1) return;

    for(let y = half; y < this.max; y += size) {
      for(let x = half; x < this.max; x += size) {
        this.square(x, y, half, Math.random() * scale * 2 - scale);
      }
    }

    for(let y = 0; y <= this.max; y += half) {
      for(let x = (y + half) % size; x <= this.max; x += size) {
        this.diamond(x, y, half, Math.random() * scale * 2 - scale);
      }
    }

    this.divide(half);
  }

  private square(x: number, y: number, size: number, offset: number): void {
    const avg = this.average(
      this.get(x - size, y - size),  // upper left
      this.get(x + size, y - size),  // upper right
      this.get(x + size, y + size),  // lower right
      this.get(x - size, y + size)   // lower left
    );

    this.set(x, y, avg + offset);
  }

  private diamond(x: number, y: number, size: number, offset: number): void {
    const avg = this.average(
      this.get(x, y - size),  // top
      this.get(x + size, y),  // right
      this.get(x, y + size),  // bottom
      this.get(x - size, y)   // left
    );

    this.set(x, y, avg + offset);
  }

  private average(...values: number[]): number {
    const valid = values.filter(x => x !== -1);
    const total = valid.reduce((sum, x) => sum + x, 0);
    return total / valid.length;
  }

  private render() {
    for(let y = 0; y < this.size; y++) {
      for(let x = 0; x < this.size; x++) {
        const val    = this.get(x, y);
        const top    = this.project(x, y, val);
        const bottom = this.project(x + 1, y, 0);
        const style  = y === 513 ? "rgb(255,0,0)" : this.brightness(x, y, this.get(x + 1, y) - val);
// console.log(y, x, top, bottom, style);
        this.rect(top, bottom, style);
        // this.rect(water)
      }
    }
  }

  private rect(a: any, b: any, style: string) {
    if(b.y < a.y) return;
    this.canvas.context.fillStyle = style;
    this.canvas.context.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
  }

  private project(flatX: number, flatY: number, flatZ: number) {
    const point = this.iso(flatX, flatY);
    const x0 = this.size * 0.5;
    const y0 = this.size * 0.2;
    const z = this.size * 0.5 - flatZ + point.y * 0.75;
    const x = (point.x - this.size * 0.5) * 6;
    const y = (this.size - point.y) * 0.005 + 1;

    return {
      x: x0 + x / y,
      y: y0 + z / y
    };
  }

  private iso(x: number, y: number) {
    return {
      x, y
      // x: 0.5 * (this.size + x - y),
      // y: 0.5 * (x + y)
    };
  }

  private brightness(x: number, y: number, slope: number) {
    const value = (y === this.max || x === this.max) ? 0 : ~~(slope * 50) + 128;
    return `rgba(${value}, ${value}, ${value}, 1)`;
  }
}