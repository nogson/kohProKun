import * as THREE from "three";
import Experience from "../Experience";
import Time from "../Utils/Time";

export default class MainCharacterController {
  experience: Experience;
  time: Time;
  animationType: string | null;
  animation: any;
  private isPressing: boolean = false;
  constructor() {
    this.experience = new Experience();

    document.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // コンテキストメニューの表示をキャンセル
    });

    // keydownイベントを監視
    window.addEventListener("keydown", (event) => {
      this.experience.world.mainCharacter.play(event.code);
    });

    // keyupイベントを監視
    window.addEventListener("keyup", (event) => {
      const currentAction =
        this.experience.world.mainCharacter.animation.action.current.name;
      this.experience.world.mainCharacter.pause();
    });

    window.addEventListener("touchstart", (event) => {
      this.isPressing = true;
      const targetElm = event.target as HTMLElement;
      const code = targetElm.getAttribute("name");
      this.animationType = code;
      this.animation = setInterval(() => this.handlePress(), 200);
    });

    window.addEventListener("touchend", (event) => {
      this.isPressing = false;
      this.animationType = null;
      const currentAction =
        this.experience.world.mainCharacter.animation.action.current.name;
      this.experience.world.mainCharacter.pause();
    });
  }

  handlePress() {
    console.log("handlePress");

    if (!this.isPressing) {
      clearInterval(this.animation);
      return;
    }

    if (this.animationType) {
      this.experience.world.mainCharacter.play(this.animationType);
    }
  }
}
