import Canvas from "./canvas";
import SunsetScene from "./sunsetScene";
import Terrain from "./terrain";
import SierpinskiScene from "./fractals/sierpinski";

export const init = () => {
  const canvas = new Canvas();
  // const scene  = new SunsetScene(canvas);
  // const scene = new Terrain(canvas);
  const scene = new SierpinskiScene(canvas);

  scene.start()
};
