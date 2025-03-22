import * as THREE from "three";
import Experience from "../Experience";
import * as CANNON from "cannon-es";
import { normalMap } from "three/examples/jsm/nodes/Nodes.js";

export default class Floor {
  gerometry: THREE.CircleGeometry;
  experience: Experience;
  textures: any;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;
  constructor() {
    this.experience = new Experience();

    this.setGeometries();
    this.setTextures();
    this.setMaterials();
    this.setMeshes();
    this.setPhysicsModel();
  }

  setGeometries() {
    // 四角形平面のジオメトリを作成
    this.gerometry = new THREE.PlaneGeometry(30, 30);

    // this.gerometry = new THREE.CircleGeometry(5, 64);
  }
  setTextures() {
    this.textures = {};
    this.textures.color = this.experience.resources.items.grassColorTexture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(3, 3);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.experience.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(3, 3);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;

    this.textures.roughness =
      this.experience.resources.items.grassRoughnessTexture;
    this.textures.roughness.repeat.set(3, 3);
    this.textures.roughness.wrapS = THREE.RepeatWrapping;
    this.textures.roughness.wrapT = THREE.RepeatWrapping;
  }
  setMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
      roughnessMap: this.textures.rough
    });
  }
  setMeshes() {
    this.mesh = new THREE.Mesh(this.gerometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.experience.scene.add(this.mesh);
  }
  setPhysicsModel() {
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.5
    );
    this.experience.world.world.addBody(floorBody);
  }
}
