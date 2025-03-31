import * as CANNON from "cannon-es";

export const ballMaterial = new CANNON.Material("ballMaterial");
export const floorMaterial = new CANNON.Material("floorMaterial");
export const rackePhysicsMaterial = new CANNON.Material("rackePhysicsMaterial");


export const contactBallAndFloorMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  floorMaterial,
  {
    friction: 0.3,
    restitution: 0.6,
  }
);

export const contactBallAndRackeMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    rackePhysicsMaterial,
    {
      friction: 0.5,
      restitution: 1,
    }
  );
