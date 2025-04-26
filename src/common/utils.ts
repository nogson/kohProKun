import * as THREE from "three";

export function getMeshSize(mesh: THREE.Object3D<THREE.Object3DEventMap>) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size;
}
