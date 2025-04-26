import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import Experience from "../Experience";
import Environment from "./Environment";
import Resources from "../Utils/Resources";
import Floor from "./Floor";
import MainCharacter from "./MainCharacter";
import CharacterController from "./MainCharacterController";
import Court from "./Court";
import BallController from "./BallController";
import Sounds from "../Utils/Sounds";
import { debounce } from "lodash";

import {
  defaultContactMaterial,
  contactBallAndFloorMaterial,
  contactBallAndRackeMaterial,
  contactBallAndCourtMaterial,
  contactBallAndNet,
} from "./Material";
import EventEmitter from "../Utils/EventEmitter";

export default class World extends EventEmitter {
  experience: Experience;
  world: CANNON.World;
  environment: Environment;
  resources: Resources;
  floor: Floor;
  characterController: CharacterController;
  court: Court;
  mainCharacter: MainCharacter;
  ballController: BallController;
  cannonDebugger: any;
  sounds: Sounds;
  group = {
    character: 1,
    other: 2,
  };
  private collisionHandled = false; // 衝突処理のフラグ
  private currentHitAreaCollisionEventId = null;

  constructor() {
    super();
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      window.document.getElementById("opening")?.remove();
      this.world = new CANNON.World();
      this.floor = new Floor();
      this.mainCharacter = new MainCharacter();
      this.environment = new Environment();
      this.characterController = new CharacterController();
      this.court = new Court();
      this.ballController = new BallController();
      this.sounds = new Sounds();

      // 衝突イベントを監視
      this.mainCharacter.racketBody.addEventListener("collide", (event) =>
        this.handleRacketCollision(event)
      );
      this.court.hitArea.addEventListener(
        "collide",
        debounce((event) => this.handleHitAreaCollision(event)),
        500
      );

      this.initWorld();
    });
  }

  update() {
    if (this.world) this.world.step(1 / 60);
    if (this.mainCharacter) this.mainCharacter.update();
    if (this.ballController) this.ballController.update();
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

  handleHitAreaCollision(event: any) {
    if (this.currentHitAreaCollisionEventId !== event.body.id) {
      this.trigger("collisionHitArea");
    }
    this.currentHitAreaCollisionEventId = event.body.id;
  }

  handleRacketCollision(event: any) {
    if (this.collisionHandled) return; // 既に処理済みなら何もしない
    this.collisionHandled = true; // フラグを立てる
    const eventName =
      this.mainCharacter.animation.action.current.getClip().name;

    if (event.body.name === "ball") {
      const ballBody = event.body;

      // 衝突点の法線ベクトルを取得（衝突の方向を示す）
      let contactNormal = event.contact.ni.clone();

      const impactForce = Math.abs(
        event.contact.getImpactVelocityAlongNormal()
      ); // 衝突の速度
      const yForceCoefficient = eventName.includes("hit") ? 3 : 2;
      const zForceCoefficient = eventName.includes("hit") ? 3 : 1.5;
      // const force = eventName === "hitRight" ? impactForce * 2.3 : impactForce;
      // ボールの速度を調整（法線ベクトルを基に反射させる）
      const newVelocity = new CANNON.Vec3(
        -contactNormal.x * impactForce, // X方向の力を反転
        Math.abs(contactNormal.y * impactForce) * yForceCoefficient, // Y方向の力を調整
        Math.abs(contactNormal.z * impactForce) * zForceCoefficient // Z方向の力を反転
      );

      ballBody.velocity.set(newVelocity.x, newVelocity.y, newVelocity.z);

      // 得点を追加
      this.trigger("collisionBall");
      // 1秒後にフラグをリセット
      setTimeout(() => (this.collisionHandled = false), 1000);
    }
  }

  setPhysicsModel() {
    this.world.defaultContactMaterial = defaultContactMaterial;
    this.experience.world.world.addContactMaterial(contactBallAndFloorMaterial);
    this.experience.world.world.addContactMaterial(contactBallAndRackeMaterial);
    this.experience.world.world.addContactMaterial(contactBallAndCourtMaterial);
    this.experience.world.world.addContactMaterial(contactBallAndNet);
  }

  gameStart() {
    this.ballController.autoCreate();
  }
}
