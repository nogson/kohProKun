import * as THREE from "three";
import Experience from "../Experience";
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
  }

  setGeometries() {
    // 四角形平面のジオメトリを作成
    this.gerometry = new THREE.PlaneGeometry(15, 15);

    // this.gerometry = new THREE.CircleGeometry(5, 64);
  }
  setTextures() {
    this.textures = {};
    this.textures.color = this.experience.resources.items.grassColorTexture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.experience.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }
  setMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }
  setMeshes() {
    this.mesh = new THREE.Mesh(this.gerometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.experience.scene.add(this.mesh);
  }
}
