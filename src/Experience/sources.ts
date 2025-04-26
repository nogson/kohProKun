export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "/kohProKun/textures/environmentMap/px.jpg",
      "/kohProKun/textures/environmentMap/nx.jpg",
      "/kohProKun/textures/environmentMap/py.jpg",
      "/kohProKun/textures/environmentMap/ny.jpg",
      "/kohProKun/textures/environmentMap/pz.jpg",
      "/kohProKun/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "courtColorTexture",
    type: "texture",
    path: "/kohProKun/textures/court/StuccoRoughCast001_COL_2K_METALNESS.png",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "/kohProKun/textures/court/StuccoRoughCast001_NRM_2K_METALNESS.png",
  },
  {
    name: "grassRoughnessTexture",
    type: "texture",
    path: "/kohProKun/textures/court/StuccoRoughCast001_ROUGHNESS_2K_METALNESS.png",
  },
  // {
  //   name: "hdrMap",
  //   type: "hdr",
  //   path: "/hdr/Netball Court 2k.hdr",
  // },
  {
    name: "mainCharacterModel",
    type: "gltfModel",
    path: "/kohProKun/models/koh/mainCharacter.glb",
  },
  {
    name: "courtModel",
    type: "gltfModel",
    path: "/kohProKun/models/koh/court.glb",
  },
  {
    name: "standSideModel",
    type: "draco",
    path: "/kohProKun/models/koh/standSide.glb",
  },
  {
    name: "standFrontBackModel",
    type: "draco",
    path: "/kohProKun/models/koh/standFrontBack.glb",
  },
];
