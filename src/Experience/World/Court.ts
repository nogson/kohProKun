import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";

export default class Court {
  experience: Experience;
  resources: any;
  model: any;
  time: any;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources.items.courtModel;
    this.time = this.experience.time;

    this.setModel();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.scale.set(1, 1, 1);
    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
    this.model.position.set(0, 0.001, 0);
    this.experience.scene.add(this.model);
  }

  setCharacterPhysicsModel() {
    // const modelSize = getMeshSize(this.model);
    // // キャラクター
    // const characterShape = new CANNON.Box(
    //   new CANNON.Vec3(modelSize.x / 2, modelSize.y / 2, modelSize.z / 2)
    // );
    // this.characterBody = new CANNON.Body({
    //   mass: 1,
    //   position: new CANNON.Vec3(0, modelSize.y / 2, 0),
    //   shape: characterShape,
    // });
    // // 回転を無効化
    // this.characterBody.angularFactor.set(0, 0, 0);
    // this.experience.world.world.addBody(this.characterBody);
  }
}
