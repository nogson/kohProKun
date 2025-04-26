import * as CANNON from "cannon-es";

const defaultMaterial = new CANNON.Material("default");
export const ballMaterial = new CANNON.Material("ballMaterial");
export const floorMaterial = new CANNON.Material("floorMaterial");
export const rackePhysicsMaterial = new CANNON.Material("rackePhysicsMaterial");
export const courtMaterial = new CANNON.Material("courtMaterial");
export const netMaterial = new CANNON.Material("netMaterial");

export const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 1,
    restitution: 0.2,
  }
);

export const contactBallAndFloorMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  floorMaterial,
  {
    friction: 0.5,
    restitution: 0.65,
  }
);

export const contactBallAndCourtMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  floorMaterial,
  {
    friction: 0.5,
    restitution: 0.65,
  }
);

export const contactBallAndRackeMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  rackePhysicsMaterial,
  {
    friction: 0.5,
    restitution: 0.65,
  }
);

export const contactBallAndNet = new CANNON.ContactMaterial(
  ballMaterial,
  netMaterial,
  {
    friction: 1,
    restitution: 0.1,
  }
);
