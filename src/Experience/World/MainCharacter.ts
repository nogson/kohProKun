import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";
import { rackePhysicsMaterial } from "./Material";

export default class MainCharacter {
  experience: Experience;
  resources: any;
  charaGroup: THREE.Group;
  model: any;
  racketModel: THREE.Group;
  animation: any;
  time: any;
  debug: any;
  debugFolder: any;
  characterBody: any;
  racketBody: any;
  private runSpeed = { x: 0, z: 0 }; // x軸とz軸の速度を管理
  private acceleration = 0.1;
  private deceleration = 0.85;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources.items.mainCharacterModel;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("MainCharacter");
    }

    this.setModel();
    this.setCharacterPhysicsModel();
    this.setRacketPhysicsModel();
    this.setAnimation();
  }

  setModel() {
    this.charaGroup = new THREE.Group();
    this.model = this.resources.scene;
    this.model.scale.set(0.25, 0.25, 0.25);
    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }

      if (child.name === "ラケットヒット面") {
        this.racketModel = child;
      }
    });

    // TODO ここでキャラクターの位置を調整
    this.charaGroup.position.set(0, -0.7, 0);
    this.charaGroup.add(this.model);
    this.experience.scene.add(this.charaGroup);
  }

  setCharacterPhysicsModel() {
    const modelSize = getMeshSize(this.model);

    // キャラクター
    const characterShape = new CANNON.Box(
      new CANNON.Vec3(modelSize.x / 2, modelSize.y / 2, modelSize.z / 2)
    );
    this.characterBody = new CANNON.Body({
      mass: 15,
      position: new CANNON.Vec3(0, modelSize.y / 2, -5),
      shape: characterShape,
    });

    // 衝突フィルタリング設定
    this.characterBody.collisionFilterGroup =
      this.experience.world.group.character;
    this.characterBody.collisionFilterMask = this.experience.world.group.other;

    // 回転を無効化
    this.characterBody.angularFactor.set(0, 0, 0);
    this.experience.world.world.addBody(this.characterBody);
  }

  setRacketPhysicsModel() {
    const modelSize = getMeshSize(this.racketModel);
    // ラケット
    const racketShape = new CANNON.Box(
      new CANNON.Vec3(modelSize.x * 1.5, modelSize.y * 1.5, 0.05)
    );
    this.racketBody = new CANNON.Body({
      mass: 0,
      shape: racketShape,
      material: rackePhysicsMaterial,
    });

    // 衝突フィルタリング設定
    this.racketBody.collisionFilterGroup =
      this.experience.world.group.character;
    this.racketBody.collisionFilterMask = this.experience.world.group.other;

    this.experience.world.world.addBody(this.racketBody);
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = {};

    this.animation.action.hitLeft = this.animation.mixer.clipAction(
      this.resources.animations[0]
    );
    this.animation.action.hitLeft.setLoop(THREE.LoopOnce, 1);
    this.animation.action.hitLeft.clampWhenFinished = true;

    this.animation.action.hitRight = this.animation.mixer.clipAction(
      this.resources.animations[1]
    );
    this.animation.action.hitRight.setLoop(THREE.LoopOnce, 1);
    this.animation.action.hitRight.clampWhenFinished = true;

    this.animation.action.pause = this.animation.mixer.clipAction(
      this.resources.animations[2]
    );

    this.animation.action.runLeft = this.animation.mixer.clipAction(
      this.resources.animations[3]
    );

    this.animation.action.runRight = this.animation.mixer.clipAction(
      this.resources.animations[4]
    );

    this.animation.action.current = this.animation.action.pause;
    this.animation.action.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.action[name];
      const oldAction = this.animation.action.current;

      if (newAction === oldAction) return;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 0.25);

      this.animation.action.current = newAction;
    };

    this.animation.mixer.addEventListener("finished", (e) => {
      // 再生速度を元に戻す
      this.animation.mixer.timeScale = 1;

      // 次のアニメーションを再生
      if (this.animation.action.current === this.animation.action.hitRight) {
        this.animation.play("pause");
      }

      if (this.animation.action.current === this.animation.action.hitLeft) {
        this.animation.play("pause");
      }
    });

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playHitLeft: () => {
          this.animation.play("hitLeft");
        },
        playHitRight: () => {
          this.animation.play("hitRight");
        },
        playPause: () => {
          this.animation.play("pause");
        },
        playRunLeft: () => {
          this.animation.play("runcLeft");
        },
        playRunRight: () => {
          this.animation.play("runcRight");
        },
      };

      this.debugFolder.add(debugObject, "playHitLeft");
      this.debugFolder.add(debugObject, "playHitRight");
      this.debugFolder.add(debugObject, "playPause");
      this.debugFolder.add(debugObject, "playRunLeft");
      this.debugFolder.add(debugObject, "playRunRight");
    }
  }

  play(code: string) {
    switch (code) {
      case "ArrowLeft":
        //this.characterBody.velocity.x -= 1.5;
        // this.characterBody.velocity.set(-5, 0, 0);
        this.runSpeed.x -= this.acceleration;
        this.animation.play("runRight");
        break;
      case "ArrowRight":
        // this.characterBody.velocity.x += 1.5;
        // this.characterBody.velocity.set(5, 0, 0);
        this.runSpeed.x += this.acceleration;

        this.animation.play("runLeft");
        break;
      case "ArrowUp":
        this.animation.mixer.timeScale = 2;
        this.animation.play("hitRight");
        break;
      case "ArrowDown":
        this.animation.mixer.timeScale = 2;
        this.animation.play("hitLeft");
        break;
      case "Space":
        this.animation.play("hitLeft");
      default:
    }
  }

  pause() {
    const eventName = this.animation.action.current.getClip().name;
    if (["runRight", "runLeft"].includes(eventName)) {
      this.animation.play("pause");
    }
  }

  updateRacketPosition() {
    // ラケットの位置と回転を物理ボディに同期
    if (this.racketModel && this.racketBody) {
      // ラケットの位置と回転を物理ボディに同期
      if (this.racketModel && this.racketBody) {
        const racketWorldPosition = new THREE.Vector3();
        const racketWorldQuaternion = new THREE.Quaternion();

        this.racketModel.getWorldPosition(racketWorldPosition);
        this.racketModel.getWorldQuaternion(racketWorldQuaternion);

        this.racketBody.position.set(
          racketWorldPosition.x,
          racketWorldPosition.y,
          racketWorldPosition.z
        );

        this.racketBody.quaternion.set(
          racketWorldQuaternion.x,
          racketWorldQuaternion.y,
          racketWorldQuaternion.z,
          racketWorldQuaternion.w
        );
      }
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);

    // キャラクターの位置をrunSpeedに基づいて更新
    this.characterBody.position.x += this.runSpeed.x;
    //this.characterBody.position.z += this.runSpeed.z;

    this.model.position.copy(this.characterBody.position);

    // 減速処理
    this.runSpeed.x *= this.deceleration;
    this.runSpeed.z *= this.deceleration;
    if (Math.abs(this.runSpeed.x) < 0.001) this.runSpeed.x = 0;
    //if (Math.abs(this.runSpeed.z) < 0.001) this.runSpeed.z = 0;

    // ラケットの位置と回転を物理ボディに同期
    this.updateRacketPosition();
  }
}
