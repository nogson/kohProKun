import * as THREE from "three";
import Experience from "../Experience";

export default class Sounds {
  hitSound: THREE.Audio; // ヒット音用のオーディオ
  soundPath: {
    [key: string]: string;
  } = {
    swing: "/sounds/swing02.mp3",
    bounce: "/sounds/bounce.mp3",
  };
  sounds: {
    [key: string]: THREE.Audio;
  } = {};

  constructor() {
    this.setSounds();
  }

  setSounds() {
    Object.keys(this.soundPath).forEach((key) => {
      const soundPath = this.soundPath[key];
      const listener = new THREE.AudioListener();
      const sound = new THREE.Audio(listener);
      const audioLoader = new THREE.AudioLoader();

      audioLoader.load(soundPath, (buffer) => {
        sound.setBuffer(buffer);
        sound.setVolume(0.5);
        sound.setLoop(false);
      });

      this.sounds[key] = sound;
    });
  }
}
