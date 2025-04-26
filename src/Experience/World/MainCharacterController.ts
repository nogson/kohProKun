import * as THREE from "three";
import Experience from "../Experience";

export default class MainCharacterController {
  experience: Experience;
  constructor() {
    this.experience = new Experience();

    // keydownイベントを監視
    window.addEventListener("keydown", (event) => {
      this.experience.world.mainCharacter.play(event.code);
    });

    // keyupイベントを監視
    window.addEventListener("keyup", (event) => {
      const currentAction =
        this.experience.world.mainCharacter.animation.action.current.name;

      // if (currentAction === "runLeft") {
      //   this.experience.world.mainCharacter.animation.mixer.timeScale = 2;
      //   this.experience.world.mainCharacter.hit("hitLeft");
      // } else if (currentAction === "runRight") {
      //   this.experience.world.mainCharacter.animation.mixer.timeScale = 2;
      //   this.experience.world.mainCharacter.hit("hitRight");
      // } else {
      this.experience.world.mainCharacter.pause();
      //}
    });
  }
}
