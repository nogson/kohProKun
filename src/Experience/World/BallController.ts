import * as THREE from "three";
import Experience from "../Experience";
import Ball from "./Ball";
import * as CANNON from "cannon-es";

export default class BallController {
  experience: Experience;
  balls: Ball[] = [];

  constructor() {
    this.experience = new Experience();

    // window.addEventListener("keydown", (event) => {
    //   if (event.code === "Digit1") {
    //     this.autoCreate();
    //   }
    // });
  }

  autoCreate() {
    setTimeout(() => {
      this.create();
    }, 1000);
    setInterval(() => this.create(), 5000); // `this.create`を明示的にバインド
  }

  create() {
    const vX = Math.random() * 6 - 3;
    const vY = Math.random() * 2;
    const vZ = (Math.random() * 3 + 5) * -1;
    console.log("create", this.balls.length);
    //const velocity = new CANNON.Vec3(0, 0, -5.5);
    const velocity = new CANNON.Vec3(vX, vY, vZ);

    this.balls.push(new Ball(velocity));
    if (this.balls.length > 2) {
      for (let i = 0; i < this.balls.length - 2; i++) {
        this.balls[i].geometry.dispose();
        this.balls[i].material.dispose();
        this.balls.splice(i, 1);
        this.experience.scene.remove(this.balls[0].mesh);
      }
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
