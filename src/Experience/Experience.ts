import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";
import GameStatus from "./GameStatus";

let instance: Experience | null = null;

export default class Experience {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: Camera;
  sizes: Sizes;
  time: Time;
  renderer: Renderer;
  world: World;
  resources: Resources;
  debug: Debug;
  gameStatus: GameStatus;
  constructor(canvas?: HTMLCanvasElement) {
    // singleton
    if (instance) {
      return instance;
    }

    instance = this;

    // setup
    if (canvas) {
      this.canvas = canvas;
    }
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.gameStatus = new GameStatus();

    // events
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });

    this.camera.on("onIntroAnimationComplete", () => {
      const startScreen = window.document.getElementById("startScreen");
      const startButton = window.document.getElementById("startButton");
      if (startScreen) {
        startScreen.classList.add("show");
      }

      if (startButton) {
        startButton.classList.add("show");
        startButton.addEventListener("click", () => {
          if (startScreen) {
            startScreen.classList.remove("show");
          }
          if (startButton) {
            startButton.classList.remove("show");
          }
          this.world.gameStart();
        });
      }
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    // cameraをアップデート後にrendererをアップデートする
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug) {
      this.debug.ui.destroy();
    }
  }
}
