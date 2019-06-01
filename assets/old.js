const init = () => {
  document.removeEventListener("load", init, true);

  // const url = "https://fonts.googleapis.com/css?family=Limelight";
  // var link = document.createElement('link');
  // link.type = 'text/css';
  // link.rel = 'stylesheet';
  // link.href = url;
  // document.getElementsByTagName('head')[0].appendChild(link);

  // // const fontLink = document.getElementById("fontLink");
  // // fontLink.addEventListener("load", () => {
  //   console.log("FONT");
  //   const img = document.createElement('img');
  //   img.onerror = () => { console.log("IMG"); render(); }
  //   img.src = url;
  render();
  // }, true);
};

const render = () => {
  // canvas
  const canvas = document.getElementById("canvas");
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width;
  canvas.height = bounds.height;

  const ctx = canvas.getContext("2d");
  const horizon = bounds.height / 100 * 80;


  // Create gradient
  var grd = ctx.createRadialGradient(200, horizon, 5, 200, horizon, bounds.width * 1.5);
  grd.addColorStop(0, "#fecd00");
  grd.addColorStop(0.2, "#d15d0a");
  grd.addColorStop(1, "black");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, bounds.width, bounds.height);

  // horizon / foreground
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, horizon-1, bounds.width, bounds.height);

  // grass
  ctx.moveTo(0, horizon);
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth = 1;
  let i = bounds.width;
  while(i--) {
    ctx.moveTo(i, horizon);
    // ctx.lineTo(i, horizon - Math.random() * 10);
    const x = i + (Math.random() * 10) - 5;
    const h = Math.random() * 10;
    const y = horizon - h;
    const cpy = horizon - (h / 2);
    ctx.quadraticCurveTo(i, cpy, x, y);
  }
  ctx.stroke();

  // obelisk
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, horizon);
  ctx.lineTo(135, horizon - 500);
  ctx.lineTo(170, horizon - 520);
  ctx.lineTo(205, horizon - 500);
  ctx.lineTo(240, horizon);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // O
  ctx.shadowBlur = 10;
  ctx.shadowColor = "white";
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = 5;
  ctx.beginPath();

  ctx.arc(170, horizon - 300, 40, 0, 2 * Math.PI);
  // ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // BELISK
  setTimeout(() => {
    ctx.fillStyle = "black";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 1;
    ctx.font = '80px "Limelight"';
    ctx.fillText("BELISK", 230, horizon - 260);
  }, 100);
}

document.addEventListener("load", init, true);
