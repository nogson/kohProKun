import * as THREE from "three";
import Experience from "../Experience";
import * as CANNON from "cannon-es";
import { ballMaterial } from "./Material";

export default class Ball {
  geometry: THREE.SphereGeometry;
  experience: Experience;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;
  ballBody: CANNON.Body;
  constructor() {
    this.experience = new Experience();

    this.setGeometries();
    this.setMaterials();
    this.setMeshes();
    this.setPhysicsModel();

    this.ballBody.velocity.z = -5;
  }

  setGeometries() {
    this.geometry = new THREE.SphereGeometry(0.07, 32, 32);
  }

  setMaterials() {
    // 球体のマテリアルを作成
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffe100,
      roughness: 1,
      metalness: 0,
    });
  }

  setMeshes() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.experience.scene.add(this.mesh);
  }
  setPhysicsModel() {
    const ballShape = new CANNON.Sphere(0.07);
    this.ballBody = new CANNON.Body({
      mass: 1,
      shape: ballShape,
      position: new CANNON.Vec3(0, 3, 2),
      material: ballMaterial,
    });
    this.ballBody.addShape(ballShape);

    this.ballBody.collisionFilterGroup = this.experience.world.group.other;
    this.experience.world.world.addBody(this.ballBody);
  }

  create() {
    this.experience.scene.add(this.mesh);
  }

  update() {
    this.mesh.position.copy(this.ballBody.position);
  }
}
