import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";

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
    //this.setRacketPhysicsModel();
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

      if (child.name === "ラケット") {
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
      mass: 1,
      position: new CANNON.Vec3(0, modelSize.y / 2, -3),
      shape: characterShape,
    });

    // 回転を無効化
    this.characterBody.angularFactor.set(0, 0, 0);
    this.experience.world.world.addBody(this.characterBody);
  }

  setRacketPhysicsModel() {
    const modelSize = getMeshSize(this.racketModel);
    // ラケット
    const racketShape = new CANNON.Box(
      new CANNON.Vec3(modelSize.x / 2, modelSize.y / 2, modelSize.z / 2)
    );
    this.racketBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0),
      shape: racketShape,
    });
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
        this.characterBody.velocity.set(-5, 0, 0);
        this.animation.play("runRight");
        break;
      case "ArrowRight":
        this.characterBody.velocity.set(5, 0, 0);
        this.animation.play("runLeft");
        break;
      case "ArrowUp":
        this.animation.play("hitRight");
        break;
      case "ArrowDown":
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

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
    const { x, y, z } = this.characterBody.position;
    this.model.position.copy(this.characterBody.position);

    // アニメーション後のメッシュの位置を取得
    if (this.racketModel) {
      const racketWorldPosition = new THREE.Vector3();
      const racketWorldQuaternion = new THREE.Quaternion();
      this.racketModel.getWorldPosition(racketWorldPosition);
      this.racketModel.getWorldQuaternion(racketWorldQuaternion);
    }
  }
}
