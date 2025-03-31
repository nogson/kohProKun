import * as THREE from "three";
import Experience from "../Experience";
import Ball from "./Ball";
import * as CANNON from "cannon-es";

export default class BallController {
  experience: Experience;
  balls: Ball[] = [];

  constructor() {
    this.experience = new Experience();

    window.addEventListener("keydown", (event) => {
      if (event.code === "Digit1") {
        this.create();
      }
    });
  }

  create() {
    const vX = Math.random() * 6 - 3;
    const vY = Math.random() * 2;
    const vZ = (Math.random() * 3 + 5) * -1;

    const velocity = new CANNON.Vec3(-0.75, 0, -6);
    this.balls.push(new Ball(velocity));
    if (this.balls.length > 10) {
      this.balls.shift();
      this.balls[0].geometry.dispose();
      this.balls[0].material.dispose();
      this.experience.scene.remove(this.balls[0].mesh);
    }
  }

  update() {
    if (this.balls.length > 0) {
      this.balls.forEach((ball) => {
        ball.update(); // 各ボールのupdateメソッドを実行
      });
    }
  }
}
