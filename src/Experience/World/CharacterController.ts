import * as THREE from "three";
import Experience from "../Experience";

export default class CharacterController {
  experience: Experience;
  constructor() {
    this.experience = new Experience();

    // keydownイベントを監視
    window.addEventListener("keydown", (event) => {
      this.experience.world.mainCharacter.play(event.code);
    });

    // keyupイベントを監視
    window.addEventListener("keyup", (event) => {
      this.experience.world.mainCharacter.pause();
    });
  }
}
