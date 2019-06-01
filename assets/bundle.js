var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("canvas", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Canvas = (function () {
        function Canvas() {
            this.element = document.getElementById("canvas");
            this.context = this.element.getContext("2d");
            this.bounds = this.element.getBoundingClientRect();
            this.element.width = this.bounds.width;
            this.element.height = this.bounds.height;
        }
        return Canvas;
    }());
    exports.default = Canvas;
});
define("scene", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scene = (function () {
        function Scene() {
            var _this = this;
            this.fps = 30;
            this.frameInterval = 1000 / this.fps;
            this.startTime = 0;
            this.lastRender = 0;
            this.animate = function () {
                window.requestAnimationFrame(_this.animate);
                var now = Date.now();
                var elapsed = now - _this.lastRender;
                if (elapsed > _this.frameInterval) {
                    _this.lastRender = now - (elapsed % _this.frameInterval);
                    _this.render(_this.lastRender);
                }
            };
        }
        Scene.prototype.start = function () {
            this.startTime = Date.now();
            this.animate();
        };
        return Scene;
    }());
    exports.default = Scene;
});
define("sunsetScene", ["require", "exports", "scene"], function (require, exports, scene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    scene_1 = __importDefault(scene_1);
    var SunsetScene = (function (_super) {
        __extends(SunsetScene, _super);
        function SunsetScene(canvas) {
            var _this = _super.call(this) || this;
            _this.canvas = canvas;
            _this.pos = _this.setScenePositions(canvas);
            _this.ticks = 0;
            _this.time = 0;
            _this.grass = [];
            _this.mountains = [];
            return _this;
        }
        SunsetScene.prototype.render = function (time) {
            this.ticks++;
            this.time = time;
            this.renderSky()
                .renderMountains()
                .renderForeground()
                .renderGrass()
                .renderObelisk()
                .renderO()
                .renderBelisk();
        };
        SunsetScene.prototype.renderSky = function () {
            var bounds = this.canvas.bounds;
            var ctx = this.canvas.context;
            var grd = ctx.createRadialGradient(200, this.pos.y, 5, 200, this.pos.y, bounds.width * 1.5);
            var p = Math.min(1, this.ticks / 100);
            var a = [255, 205, 0];
            var b = [210, 90, 10];
            grd.addColorStop(0.0, "rgb(" + a.map(function (x) { return x * p; }).join(",") + ")");
            grd.addColorStop(0.2, "rgb(" + b.map(function (x) { return x * p; }).join(",") + ")");
            grd.addColorStop(1.0, "rgb(0,0,0)");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, bounds.width, bounds.height);
            return this;
        };
        SunsetScene.prototype.renderMountains = function () {
            var bounds = this.canvas.bounds;
            var ctx = this.canvas.context;
            var horizon = bounds.height * 0.7;
            if (this.mountains.length === 0) {
                var _loop_1 = function (i) {
                    var size = Math.pow(2, 8);
                    var values = new Float32Array(size);
                    var max = bounds.height / 3;
                    var half = size;
                    while (half > 2) {
                        var scale = half * 3;
                        half = half / 2;
                        for (var x = half; x < size; x += half) {
                            var valid = [
                                values[x],
                                values[x - half],
                                values[x + half]
                            ]
                                .filter(function (x) { return x > 0; });
                            var total = valid.reduce(function (sum, x) { return sum + x; }, 0);
                            var avg = total / valid.length || 0;
                            var val = avg + (Math.random() * scale) - (scale / 2);
                            values[x] = val > max ? max : val;
                        }
                    }
                    var min = values.reduce(function (min, x) { return x > 0 && x < min ? x : min; }, Infinity);
                    this_1.mountains.push(values.map(function (x) { return x - min; }));
                };
                var this_1 = this;
                for (var i = 0; i < 1; i++) {
                    _loop_1(i);
                }
            }
            ctx.save();
            ctx.lineJoin = "round";
            ctx.strokeStyle = "rgba(0,0,0,0.8)";
            this.mountains.forEach(function (m, index) {
                var adjust = bounds.width / m.length;
                var base = horizon * (0.8 + (index * 0.1));
                ctx.fillStyle = "rgba(" + (100 - index * 25) + ",0,0,0.9)";
                ctx.beginPath();
                ctx.moveTo(-100, base);
                m.forEach(function (v, x) {
                    if (v > 0)
                        ctx.lineTo(x * adjust, base - v);
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
        };
        SunsetScene.prototype.renderForeground = function () {
            var bounds = this.canvas.bounds;
            var ctx = this.canvas.context;
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, this.pos.y, bounds.width, bounds.height);
            return this;
        };
        SunsetScene.prototype.renderGrass = function () {
            var bounds = this.canvas.bounds;
            var ctx = this.canvas.context;
            var horizon = this.pos.y;
            if (this.grass.length === 0) {
                var i = bounds.width;
                while (i--) {
                    var h = Math.random() * 15;
                    var x = i;
                    var y = horizon;
                    var cpx = x;
                    var cpy = horizon - (h / 2);
                    this.grass.push({ h: h, x: x, y: y, cpx: cpx, cpy: cpy });
                }
            }
            ctx.beginPath();
            ctx.moveTo(0, horizon);
            ctx.lineWidth = 2;
            var angle = (Math.PI / 2) + Math.sin(this.time * 0.0005) * (Math.PI / 180) * (45 * Math.cos(this.time * 0.0002));
            this.grass.forEach(function (grass) {
                ctx.moveTo(grass.x, grass.y);
                var px = grass.x + grass.h * Math.cos(angle);
                var py = grass.y - grass.h * Math.sin(angle);
                ctx.quadraticCurveTo(grass.cpx, grass.cpy, px, py);
            });
            ctx.stroke();
            return this;
        };
        SunsetScene.prototype.renderObelisk = function () {
            var horizon = this.pos.y;
            var progress = 1;
            var ctx = this.canvas.context;
            ctx.save();
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = 1;
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
        };
        SunsetScene.prototype.renderO = function () {
            var start = 50;
            if (this.ticks < start)
                return this;
            var horizon = this.pos.y;
            var ctx = this.canvas.context;
            var percent = Math.min((this.ticks - start) / 25, 1);
            var startAngle = 0 - Math.PI / 2;
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(this.pos.x + 70, horizon - 300, 40, startAngle, startAngle + ((2 * Math.PI) * percent));
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            return this;
        };
        SunsetScene.prototype.renderBelisk = function () {
            var start = 80;
            if (this.ticks < start)
                return this;
            var ctx = this.canvas.context;
            var colour = "rgba(0,0,0," + (this.ticks - start) / 50 + ")";
            ctx.save();
            ctx.font = '80px "Limelight"';
            ctx.fillStyle = colour;
            ctx.shadowColor = colour;
            ctx.shadowBlur = 1;
            ctx.fillText("BELISK", this.pos.x + 130, this.pos.y - 260);
            ctx.restore();
            return this;
        };
        SunsetScene.prototype.setScenePositions = function (canvas) {
            var x = canvas.bounds.width / 100 * 30;
            var y = canvas.bounds.height / 100 * 90;
            return { x: x, y: y };
        };
        return SunsetScene;
    }(scene_1.default));
    exports.default = SunsetScene;
});
define("terrain", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Terrain = (function () {
        function Terrain(canvas) {
            this.canvas = canvas;
            this.size = Math.pow(2, 9) + 1;
            console.log("SIZE: ", this.size);
            this.max = this.size - 1;
            this.map = new Float32Array(this.size * this.size);
        }
        Terrain.prototype.start = function () {
            this.generate(0.7);
            this.render();
        };
        Terrain.prototype.get = function (x, y) {
            return (x < 0 || x > this.max || y < 0 || y > this.max)
                ? -1
                : this.map[x + this.size * y];
        };
        Terrain.prototype.set = function (x, y, val) {
            this.map[x + this.size * y] = val;
        };
        Terrain.prototype.generate = function (roughness) {
            this.set(0, 0, this.max);
            this.set(this.max, 0, this.max / 2);
            this.set(this.max, this.max, 0);
            this.set(0, this.max, this.max / 2);
            this.divide(this.max);
        };
        Terrain.prototype.divide = function (size) {
            var half = size / 2;
            var scale = 0.7 * size;
            if (half < 1)
                return;
            for (var y = half; y < this.max; y += size) {
                for (var x = half; x < this.max; x += size) {
                    this.square(x, y, half, Math.random() * scale * 2 - scale);
                }
            }
            for (var y = 0; y <= this.max; y += half) {
                for (var x = (y + half) % size; x <= this.max; x += size) {
                    this.diamond(x, y, half, Math.random() * scale * 2 - scale);
                }
            }
            this.divide(half);
        };
        Terrain.prototype.square = function (x, y, size, offset) {
            var avg = this.average(this.get(x - size, y - size), this.get(x + size, y - size), this.get(x + size, y + size), this.get(x - size, y + size));
            this.set(x, y, avg + offset);
        };
        Terrain.prototype.diamond = function (x, y, size, offset) {
            var avg = this.average(this.get(x, y - size), this.get(x + size, y), this.get(x, y + size), this.get(x - size, y));
            this.set(x, y, avg + offset);
        };
        Terrain.prototype.average = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            var valid = values.filter(function (x) { return x !== -1; });
            var total = valid.reduce(function (sum, x) { return sum + x; }, 0);
            return total / valid.length;
        };
        Terrain.prototype.render = function () {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var val = this.get(x, y);
                    var top_1 = this.project(x, y, val);
                    var bottom = this.project(x + 1, y, 0);
                    var style = y === 513 ? "rgb(255,0,0)" : this.brightness(x, y, this.get(x + 1, y) - val);
                    this.rect(top_1, bottom, style);
                }
            }
        };
        Terrain.prototype.rect = function (a, b, style) {
            if (b.y < a.y)
                return;
            this.canvas.context.fillStyle = style;
            this.canvas.context.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
        };
        Terrain.prototype.project = function (flatX, flatY, flatZ) {
            var point = this.iso(flatX, flatY);
            var x0 = this.size * 0.5;
            var y0 = this.size * 0.2;
            var z = this.size * 0.5 - flatZ + point.y * 0.75;
            var x = (point.x - this.size * 0.5) * 6;
            var y = (this.size - point.y) * 0.005 + 1;
            return {
                x: x0 + x / y,
                y: y0 + z / y
            };
        };
        Terrain.prototype.iso = function (x, y) {
            return {
                x: x, y: y
            };
        };
        Terrain.prototype.brightness = function (x, y, slope) {
            var value = (y === this.max || x === this.max) ? 0 : ~~(slope * 50) + 128;
            return "rgba(" + value + ", " + value + ", " + value + ", 1)";
        };
        return Terrain;
    }());
    exports.default = Terrain;
});
define("init", ["require", "exports", "canvas", "sunsetScene"], function (require, exports, canvas_1, sunsetScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    canvas_1 = __importDefault(canvas_1);
    sunsetScene_1 = __importDefault(sunsetScene_1);
    exports.init = function () {
        var canvas = new canvas_1.default();
        var scene = new sunsetScene_1.default(canvas);
        scene.start();
    };
});
//# sourceMappingURL=bundle.js.map