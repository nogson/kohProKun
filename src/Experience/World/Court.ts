import Experience from "../Experience";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { getMeshSize } from "../../common/utils";
import { netMaterial } from "./Material";

export default class Court {
  experience: Experience;
  courtModel: any;
  standSideModel: any;
  standFrontBackModel: any;
  hitArea: any;
  court: any;
  time: any;
  netBody: any;
  constructor() {
    this.experience = new Experience();
    this.courtModel = this.experience.resources.items.courtModel;
    this.standSideModel = this.experience.resources.items.standSideModel;
    this.standFrontBackModel =
      this.experience.resources.items.standFrontBackModel;
    this.time = this.experience.time;

    this.setCortModel();
    this.setstandSideModel();
    this.setFrontBackModel();
    this.setPhysicsModel();
  }

  setCortModel() {
    this.court = this.courtModel.scene;
    this.court.scale.set(1, 1, 1);
    this.court.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.court.position.set(0, 0.001, 0);
    this.experience.scene.add(this.court);
  }

  setstandSideModel() {
    this.standSideModel.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.standSideModel.scene.position.set(0, 0, 0);
    this.experience.scene.add(this.standSideModel.scene);

    // Z軸で反転したスタンドを複製
    const mirroredStand = this.standSideModel.scene.clone();
    mirroredStand.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    mirroredStand.scale.z = -1; // X軸で反転
    mirroredStand.position.set(0, 0, 0); // 必要に応じて位置を調整
    this.experience.scene.add(mirroredStand);
  }

  setFrontBackModel() {
    this.standFrontBackModel.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.standFrontBackModel.scene.position.set(0, -0.25, 0);
    this.experience.scene.add(this.standFrontBackModel.scene);

    // X軸で反転したスタンドを複製
    const mirroredStand = this.standFrontBackModel.scene.clone();
    mirroredStand.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    mirroredStand.scale.x = -1; // X軸で反転
    mirroredStand.position.set(0, 0.25, 0); // 必要に応じて位置を調整
    this.experience.scene.add(mirroredStand);
  }

  setPhysicsModel() {
    const netShape = new CANNON.Box(new CANNON.Vec3(4.5, 0.4, 0.02));
    this.netBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0.46, 0),
      shape: netShape,
      material: netMaterial,
    });
    this.netBody.name = "net";
    // 回転を無効化
    this.netBody.angularFactor.set(0, 0, 0);
    this.experience.world.world.addBody(this.netBody);

    // hitAreaの作成
    const hitAreaShape = new CANNON.Box(new CANNON.Vec3(3.5, 2.5, 0.001));
    this.hitArea = new CANNON.Body({
      mass: 0,
      shape: hitAreaShape,
    });
    this.hitArea.name = "hitArea";
    this.hitArea.position.set(0, 0, 2.5);
    this.hitArea.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.5
    );
    this.experience.world.world.addBody(this.hitArea);
  }
}
