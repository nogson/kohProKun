import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";
import { rackePhysicsMaterial } from "./Material";

export default class MainCharacter {
  experience: Experience;
  resources: any;
  charaGroup: THREE.Group;
  mainCharaModel: any;
  racketModel: THREE.Group;
  animation: any;
  time: any;
  debug: any;
  debugFolder: any;
  characterBody: any;
  racketBody: any;
  private runSpeed = { x: 0, z: 0 }; // x軸とz軸の速度を管理
  private acceleration = 0.05;
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
    //this.setCharacterPhysicsModel();
    this.setRacketPhysicsModel();
    this.setAnimation();
  }

  setModel() {
    this.charaGroup = new THREE.Group();
    this.mainCharaModel = this.resources.scene;
    this.mainCharaModel.scale.set(0.25, 0.25, 0.25);
    this.mainCharaModel.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }

      if (child.name === "ラケットヒット面") {
        this.racketModel = child;
      }
    });

    // TODO ここでキャラクターの位置を調整
    this.charaGroup.position.set(0, 0, -5);
    //this.charaGroup.position.set(0, -0.7, 0);
    this.charaGroup.add(this.mainCharaModel);
    this.experience.scene.add(this.charaGroup);
  }

  setCharacterPhysicsModel() {
    const modelSize = getMeshSize(this.mainCharaModel);

    // キャラクター
    const characterShape = new CANNON.Box(
      new CANNON.Vec3(modelSize.x / 2, modelSize.y / 2, modelSize.z / 2)
    );
    this.characterBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, modelSize.y / 2, -5),
      shape: characterShape,
    });

    this.characterBody.name = "character";

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
    const racketShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.05));
    this.racketBody = new CANNON.Body({
      mass: 0,
      shape: racketShape,
      material: rackePhysicsMaterial,
    });

    this.racketBody.name = "racket";

    this.racketBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.2
    );

    // 衝突フィルタリング設定
    this.racketBody.collisionFilterGroup =
      this.experience.world.group.character;
    this.racketBody.collisionFilterMask = this.experience.world.group.other;

    this.experience.world.world.addBody(this.racketBody);
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.mainCharaModel);
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
      this.resources.animations[4]
    );

    this.animation.action.runRight = this.animation.mixer.clipAction(
      this.resources.animations[5]
    );
    this.animation.action.runFronBack = this.animation.mixer.clipAction(
      this.resources.animations[3]
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
      this.animation.action.current.name = name;
    };

    this.animation.mixer.addEventListener("finished", (e) => {
      // 再生速度を元に戻す
      this.animation.mixer.timeScale = 1;
      const currentAction = this.animation.action.current;
      // 次のアニメーションを再生

      if (currentAction === this.animation.action.hitRight) {
        this.updateRacketBodySize({ x: 0.1, y: 0.1, z: 0.05 });
        this.animation.play("pause");
      }

      if (currentAction === this.animation.action.hitLeft) {
        this.updateRacketBodySize({ x: 0.1, y: 0.1, z: 0.05 });
        this.animation.play("pause");
      }
    });

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playHitLeft: () => {
          this.hit("hitLeft");
        },
        playHitRight: () => {
          this.hit("hitRight");
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
        playRunFronBack: () => {
          this.animation.play("runFronBack");
        },
      };

      this.debugFolder.add(debugObject, "playHitLeft");
      this.debugFolder.add(debugObject, "playHitRight");
      this.debugFolder.add(debugObject, "playPause");
      this.debugFolder.add(debugObject, "playRunLeft");
      this.debugFolder.add(debugObject, "playRunRight");
      this.debugFolder.add(debugObject, "playRunFronBack");
    }
  }

  getBallDirctionForGlobalPositions() {
    const characterPosition = new THREE.Vector3();
    const ballPosition = new THREE.Vector3();

    // MainCharacterのグローバル座標を取得
    if (this.charaGroup) {
      this.charaGroup.getWorldPosition(characterPosition);
    }

    // Ballのグローバル座標を取得
    const ball =
      this.experience.world.ballController.balls[
        this.experience.world.ballController.balls.length - 1
      ]; // 最初のボールを取得
    if (ball && ball.ballBody) {
      ballPosition.set(
        ball.ballBody.position.x,
        ball.ballBody.position.y,
        ball.ballBody.position.z
      );
    }

    return characterPosition.x < ballPosition.x ? "hitLeft" : "hitRight";
  }

  hit(direction?: string) {
    let dir = direction || this.getBallDirctionForGlobalPositions();
    this.animation.mixer.timeScale = 1.25;
    this.updateRacketBodySize({ x: 1.25, y: 1.1, z: 0.05 });
    this.animation.play(dir);
  }
  
  play(code: string) {
    switch (code) {
      case "ArrowLeft":
        this.runSpeed.x -= this.acceleration;
        this.updateRacketBodySize({ x: 1, y: 0.5, z: 0.05 });
        this.animation.play("runRight");
        break;
      case "ArrowRight":
        this.updateRacketBodySize({ x: 1, y: 0.5, z: 0.05 });
        this.runSpeed.x += this.acceleration;
        this.animation.play("runLeft");
        break;
      case "ArrowUp":
        this.animation.mixer.timeScale = 3;
        this.runSpeed.z -= this.acceleration;
        this.animation.play("runFronBack");
        break;
      case "ArrowDown":
        this.runSpeed.z += this.acceleration;
        this.animation.play("runFronBack");
        break;
      case "Space":
        this.hit();
      default:
    }
  }

  pause() {
    const eventName = this.animation.action.current.getClip().name;
    if (["runRight", "runLeft", "runFrontBack"].includes(eventName)) {
      this.updateRacketBodySize({ x: 0.1, y: 0.1, z: 0.05 });
      this.animation.play("pause");
      this.animation.mixer.timeScale = 1;
    }
  }

  updateRacketBodySize(newSize: { x: number; y: number; z: number }) {
    // 新しい形状を作成
    const newRacketShape = new CANNON.Box(
      new CANNON.Vec3(newSize.x / 2, newSize.y / 2, newSize.z / 2)
    );

    // 古い形状を削除
    this.racketBody.shapes = []; // 既存の形状をクリア

    // 新しい形状を追加
    this.racketBody.addShape(newRacketShape);
  }

  updateRacketPosition() {
    const animationName = this.animation.action.current.getClip().name;
    let racketHitPosthreshold = 0;
    const axis = new THREE.Vector3(0, 0, 1); // Y軸を基準に回転
    const angle = THREE.MathUtils.degToRad(90); // 45度をラジアンに変換

    // ラケットの位置と回転を物理ボディに同期
    if (this.racketModel && this.racketBody) {
      // const characterWorldPosition = new THREE.Vector3();
      const racketWorldPosition = new THREE.Vector3();
      const racketWorldQuaternion = new THREE.Quaternion();
      // this.charaGroup.getWorldPosition(characterWorldPosition);
      this.racketModel.getWorldPosition(racketWorldPosition);
      this.racketModel.getWorldQuaternion(racketWorldQuaternion);

      if (animationName === "hitRight") {
        racketHitPosthreshold = -0.7;
        //racketWorldQuaternion.setFromAxisAngle(axis, angle);
      } else if (animationName === "hitLeft") {
        // racketHitPosthreshold = 0.2;
        //racketWorldQuaternion.setFromAxisAngle(axis, angle);
      }
      this.racketBody.position.set(
        racketWorldPosition.x + racketHitPosthreshold,
        0.6, //racketWorldPosition.y,
        racketWorldPosition.z + 0.3
      );

      // this.racketBody.quaternion.set(
      //   racketWorldQuaternion.x,
      //   racketWorldQuaternion.y,
      //   racketWorldQuaternion.z,
      //   racketWorldQuaternion.w
      // );
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
    this.charaGroup.position.x += this.runSpeed.x;
    this.charaGroup.position.z += this.runSpeed.z;
    // 減速処理
    this.runSpeed.x *= this.deceleration;
    this.runSpeed.z *= this.deceleration;
    if (Math.abs(this.runSpeed.x) < 0.001) this.runSpeed.x = 0;
    //if (Math.abs(this.runSpeed.z) < 0.001) this.runSpeed.z = 0;

    // ラケットの位置と回転を物理ボディに同期
    this.updateRacketPosition();
  }
}
