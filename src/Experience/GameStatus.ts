import * as THREE from "three";
import Experience from "./Experience";
import EventEmitter from "./Utils/EventEmitter";

export default class GameStatus extends EventEmitter {
  scoreElment: HTMLElement;
  score: number = 0;
  eventEmitter: EventEmitter;
  experience: Experience;
  constructor() {
    super();
    this.experience = new Experience();
    this.eventEmitter = new EventEmitter();
    this.scoreElment = document.getElementById(
      "gameStatusScore"
    ) as HTMLElement;
    this.scoreElment.innerHTML = "0";

    this.experience.world.on("collisionHitArea", () => {
      this.setScore(100);
    });
    this.experience.world.on("collisionBall", () => {
      this.setScore(10);
    });
  }

  setScore(point) {
    this.score += point;
    this.scoreElment.innerHTML = String(this.score);
  }
}
