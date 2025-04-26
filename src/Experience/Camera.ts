import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import EventEmitter from "./Utils/EventEmitter";
import gsap from "gsap";

export default class Camera extends EventEmitter {
  experience: Experience;
  instance: THREE.PerspectiveCamera;
  controls: OrbitControls;
  constructor() {
    super();
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
    this.instance.position.set(0, 50, 50);
    // this.instance.position.set(0, 4, 10);
    this.experience.scene.add(this.instance);

    this.initAnimations();
  }

  initAnimations() {
    const targetPosition = new THREE.Vector3(0, 4, 10);
    const duration = 3;

    const tween = gsap.to(this.instance.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: function () {
        this.instance.lookAt(0, 0, 0);
      }.bind(this),
      onComplete: function () {
        this.trigger("onIntroAnimationComplete");
      }.bind(this),
    });
  }

  setObitControls() {
    this.controls = new OrbitControls(this.instance, this.experience.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    // this.instance.aspect = this.experience.sizes.aspectRatio;
    // this.instance.updateProjectionMatrix();
  }

  update() {
    // this.controls.update();
  }
}
