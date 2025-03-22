import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import Experience from "../Experience";
import Environment from "./Environment";
import Resources from "../Utils/Resources";
import Floor from "./Floor";
import MainCharacter from "./MainCharacter";
import CharacterController from "./CharacterController";
import Court from "./Court";

export default class World {
  experience: Experience;
  world: CANNON.World;
  environment: Environment;
  resources: Resources;
  floor: Floor;
  characterController: CharacterController;
  court: Court;
  mainCharacter: MainCharacter;
  cannonDebugger: any;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.world = new CANNON.World();
      this.floor = new Floor();
      this.mainCharacter = new MainCharacter();
      this.environment = new Environment();
      this.characterController = new CharacterController();
      this.court = new Court();

      this.initWorld();
    });
  }

  update() {
    if (this.world) this.world.step(1 / 60);
    if (this.mainCharacter) this.mainCharacter.update();
    if (this.cannonDebugger) this.cannonDebugger.update();
  }

  initWorld() {
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    // SolverをGSSolverにキャストしてiterationsを設定
    const solver = this.world.solver as CANNON.GSSolver;
    solver.iterations = 30;
    solver.tolerance = 0.01; // 許容誤差を設定

    // CannonDebuggerの設定
    this.cannonDebugger = CannonDebugger(this.experience.scene, this.world, {
      color: 0xff0000, // デバッグ用のボディの色
    });
  }
}
