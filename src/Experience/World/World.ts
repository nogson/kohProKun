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
import BallController from "./BallController";
import {
  defaultContactMaterial,
  contactBallAndFloorMaterial,
  contactBallAndRackeMaterial,
  contactBallAndCourtMaterial,
} from "./Material";

export default class World {
  experience: Experience;
  world: CANNON.World;
  environment: Environment;
  resources: Resources;
  floor: Floor;
  characterController: CharacterController;
  court: Court;
  mainCharacter: MainCharacter;
  BallController: BallController;
  cannonDebugger: any;
  group = {
    character: 1,
    other: 2,
  };
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
      this.BallController = new BallController();

      // 衝突イベントを監視
      this.mainCharacter.racketBody.addEventListener("collide", (event) => {
        this.handleCollision(event);
      });

      this.initWorld();
    });
  }

  update() {
    if (this.world) this.world.step(1 / 60);
    if (this.mainCharacter) this.mainCharacter.update();
    if (this.BallController) this.BallController.update();
    if (this.cannonDebugger) this.cannonDebugger.update();
  }

  initWorld() {
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    // SolverをGSSolverにキャストしてiterationsを設定
    const solver = this.world.solver as CANNON.GSSolver;
    solver.iterations = 30;
    solver.tolerance = 0.01; // 許容誤差を設定
    this.setPhysicsModel();

    // CannonDebuggerの設定
    if (this.experience.debug.active) {
      this.cannonDebugger = CannonDebugger(this.experience.scene, this.world, {
        color: 0xff0000, // デバッグ用のボディの色
      });
    }
  }

  handleCollision(event: any) {
    const bodyA = event.body; // 衝突した1つ目のボディ
    const bodyB = event.target; // 衝突した2つ目のボディ
    if (event.body.name === "ball") {
      console.log("Ball hit the racket!", event.body.velocity.z);
      event.body.velocity.x = 0;
      event.body.velocity.y = 5;
      event.body.velocity.z = -3;
    }
  }

  setPhysicsModel() {
    this.world.defaultContactMaterial = defaultContactMaterial;
    this.experience.world.world.addContactMaterial(contactBallAndFloorMaterial);
    this.experience.world.world.addContactMaterial(contactBallAndRackeMaterial);
    this.experience.world.world.addContactMaterial(contactBallAndCourtMaterial);
  }
}
