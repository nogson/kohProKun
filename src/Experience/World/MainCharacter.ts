import Experience from "../Experience";
import * as THREE from "three";

export default class MainCharacter {
  experience: Experience;
  resources: any;
  model: any;
  animation: any;
  time: any;
  debug: any;
  debugFolder: any;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources.items.foxModel;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("MainCharacter");
    }

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.scale.set(0.25, 0.25, 0.25);
    this.experience.scene.add(this.model);

    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    this.animation.action = {};
    console.log(this.resources.animations);

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
        this.animation.play("runRight");

        break;
      case "ArrowRight":
        this.animation.play("runLeft");

        break;
      case "ArrowUp":
        break;
      case "ArrowDown":
        this.animation.play("hitRight");

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
  }
}
