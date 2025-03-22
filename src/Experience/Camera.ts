import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  experience: Experience;
  instance: THREE.PerspectiveCamera;
  controls: OrbitControls;
  constructor() {
    this.experience = new Experience();
    this.setInstance();
    this.setObitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.experience.sizes.aspectRatio,
      0.1,
      100
    );
    this.instance.position.set(6, 4, 8);
    this.experience.scene.add(this.instance);
  }

  setObitControls() {
    this.controls = new OrbitControls(this.instance, this.experience.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.experience.sizes.aspectRatio;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
