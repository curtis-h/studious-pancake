import Canvas from "./canvas";
import Scene from "./scene";

interface ScenePos {
  x: number;
  y: number;
}

export default class SunsetScene extends Scene {
  private pos: ScenePos;
  private ticks: number;
  private time: number;
  private grass: any[];
  private mountains: any;

  constructor(canvas: Canvas) {
    super(canvas);
    this.pos       = this.setScenePositions(canvas);
    this.ticks     = 0;
    this.time      = 0;
    this.grass     = [];
    this.mountains = [];
  }

  protected render(time: number) {
    this.ticks++;
    this.time = time;

    this.renderSky()
        .renderMountains()
        .renderForeground()
        .renderGrass()
        .renderObelisk()
        .renderO()
        .renderBelisk()
  }

  // Renderers
  private renderSky() {
    const bounds = this.canvas.bounds;
    const ctx    = this.canvas.context;
    const grd    = ctx.createRadialGradient(200, this.pos.y, 5, 200, this.pos.y, bounds.width * 1.5);

    // Create gradient
    const p = Math.min(1, this.ticks / 100);
    const a = [255, 205, 0];
    const b = [210, 90, 10];
    grd.addColorStop(0.0, "rgb("+ a.map(x => x * p).join(",") +")");
    grd.addColorStop(0.2, "rgb("+ b.map(x => x * p).join(",") +")");
    grd.addColorStop(1.0, "rgb(0,0,0)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, bounds.width, bounds.height);

    return this;
  }

  renderMountains() {
    const bounds  = this.canvas.bounds;
    const ctx     = this.canvas.context;
    const horizon = bounds.height * 0.7;

    if(this.mountains.length === 0) {
      for(let i = 0; i < 1; i++) {
        const size = Math.pow(2, 8);
        const values = new Float32Array(size);
        const max = bounds.height / 3;
        let half = size;

        while(half > 2) {
          const scale = half * 3;
          half = half / 2;

          for(let x = half; x < size; x += half) {
            const valid = [
              values[x],
              values[x - half],
              values[x + half]
            ]
            .filter(x => x > 0);

            const total = valid.reduce((sum, x) => sum + x, 0);
            const avg   = total / valid.length || 0;
            const val   = avg + (Math.random() * scale) - (scale / 2);
            values[x]   = val > max ? max : val;
          }
        }

        const min = values.reduce((min, x) => x > 0 && x < min ? x : min, Infinity);
        this.mountains.push(values.map(x => x - min));
      }
    }

    ctx.save();
    ctx.lineJoin = "round";
    ctx.strokeStyle = `rgba(0,0,0,0.8)`;

    this.mountains.forEach((m: any[], index: number) => {
      const adjust = bounds.width / m.length;
      const base   = horizon * (0.8 + (index * 0.1));



      ctx.fillStyle = `rgba(${100 - index * 25},0,0,0.9)`;
      ctx.beginPath();
      ctx.moveTo(-100, base);

      m.forEach((v: number, x: number) => {
        if(v > 0) ctx.lineTo(x * adjust, base - v);
      });

      ctx.lineTo(bounds.width + 100, base);
      ctx.lineTo(bounds.width, bounds.height);
      ctx.lineTo(0, bounds.height);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    });
    ctx.restore();

    return this;
  }

  private renderForeground() {
    const bounds = this.canvas.bounds;
    const ctx    = this.canvas.context;

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, this.pos.y, bounds.width, bounds.height);

    return this;
  }

  private renderGrass() {
    const bounds  = this.canvas.bounds;
    const ctx     = this.canvas.context;
    const horizon = this.pos.y;

    if(this.grass.length === 0) {
      let i = bounds.width;
      while(i--) {
        const h   = Math.random() * 15;
        const x   = i;
        const y   = horizon;
        const cpx = x;
        const cpy = horizon - (h / 2);
        this.grass.push({ h, x, y, cpx, cpy });
      }
    }

    ctx.beginPath();
    ctx.moveTo(0, horizon);
    // ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 2;

    const angle = (Math.PI / 2) + Math.sin(this.time * 0.0005) * (Math.PI / 180) * (45 * Math.cos(this.time * 0.0002));

    this.grass.forEach(grass => {
      ctx.moveTo(grass.x, grass.y);

      const px  = grass.x + grass.h * Math.cos(angle);
      const py  = grass.y - grass.h * Math.sin(angle);

      ctx.quadraticCurveTo(grass.cpx, grass.cpy, px, py);
    });
    ctx.stroke();

    return this;
  }

  private renderObelisk() {
    const horizon   = this.pos.y;
    const progress  = 1;//Math.min(this.ticks / 50, 1);
    const ctx       = this.canvas.context;
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(this.pos.x, horizon);
    ctx.lineTo(this.pos.x + 35, horizon - (500 * progress));
    ctx.lineTo(this.pos.x + 70, horizon - (520 * progress));
    ctx.lineTo(this.pos.x + 105, horizon - (500 * progress));
    ctx.lineTo(this.pos.x + 140, horizon);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    return this;
  }

  private renderO() {
    const start = 50;
    if(this.ticks < start) return this;

    const horizon    = this.pos.y;
    const ctx        = this.canvas.context;
    const percent    = Math.min((this.ticks - start) / 25, 1);
    const startAngle = 0 - Math.PI / 2;
    ctx.save();
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "white";
    ctx.strokeStyle = "white";
    ctx.fillStyle   = "white";
    ctx.lineWidth   = 5;
    ctx.beginPath();
    ctx.arc(this.pos.x + 70, horizon - 300, 40, startAngle, startAngle + ((2 * Math.PI) * percent));
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    return this;
  }

  private renderBelisk() {
    const start = 80;
    if(this.ticks < start) return this;

    const ctx       = this.canvas.context;
    const colour    = "rgba(0,0,0,"+ (this.ticks - start) / 50 +")";
    ctx.save();
    ctx.font        = '80px "Limelight"';
    ctx.fillStyle   = colour;
    ctx.shadowColor = colour;
    ctx.shadowBlur  = 1;
    ctx.fillText("BELISK", this.pos.x + 130, this.pos.y - 260);
    ctx.restore();
    return this;
  }

  // Misc
  private setScenePositions(canvas: Canvas): ScenePos {
    const x = canvas.bounds.width / 100 * 30;
    const y = canvas.bounds.height / 100 * 90;
    return { x, y };
  }
}