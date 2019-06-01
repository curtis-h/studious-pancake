import Canvas from "./canvas";
import SunsetScene from "./sunsetScene";
import Terrain from "./terrain";

export const init = () => {
  const canvas = new Canvas();
  const scene  = new SunsetScene(canvas);
  // const scene = new Terrain(canvas);

  scene.start()
};
