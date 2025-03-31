import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";

export default class Court {
  experience: Experience;
  resources: any;
  model: any;
  time: any;
  netBody: any;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources.items.courtModel;
    this.time = this.experience.time;

    this.setModel();
    this.setPhysicsModel();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.scale.set(1, 1, 1);
    this.model.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.model.position.set(0, 0.001, 0);
    this.experience.scene.add(this.model);
  }

  setPhysicsModel() {
    const netShape = new CANNON.Box(new CANNON.Vec3(4.5, 0.4, 0.02));
    this.netBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0.46, 0),
      shape: netShape,
    });
    // 回転を無効化
    this.netBody.angularFactor.set(0, 0, 0);
    this.experience.world.world.addBody(this.netBody);
  }
}
