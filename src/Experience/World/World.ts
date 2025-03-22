import * as THREE from "three";
import CANNON from "cannon-es";
import Experience from "../Experience";
import Environment from "./Environment";
import Resources from "../Utils/Resources";
import Floor from "./Floor";
import MainCharacter from "./MainCharacter";
import CharacterController from "./CharacterController";

export default class World {
  experience: Experience;
  world: CANNON.World;
  environment: Environment;
  resources: Resources;
  floor: Floor;
  characterController: CharacterController;
  mainCharacter: MainCharacter;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.world = new CANNON.World();
      this.floor = new Floor();
      this.mainCharacter = new MainCharacter();
      this.environment = new Environment();
      this.characterController = new CharacterController();

      this.initWorld();
    });
  }

  update() {
    if (this.mainCharacter) this.mainCharacter.update();
  }

  initWorld() {
    this.world.gravity.set(0, -9.82, 0);
  }
}
