import * as THREE from "three";
import Experience from "../Experience";
import Ball from "./Ball";

export default class BallController {
  experience: Experience;
  ball: Ball;

  constructor() {
    this.experience = new Experience();
    this.ball = new Ball();
  }

  update() {
    if (this.ball) this.ball.update();
  }
}
