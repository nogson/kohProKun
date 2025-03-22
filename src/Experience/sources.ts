export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "/textures/environmentMap/px.jpg",
      "/textures/environmentMap/nx.jpg",
      "/textures/environmentMap/py.jpg",
      "/textures/environmentMap/ny.jpg",
      "/textures/environmentMap/pz.jpg",
      "/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "/textures/court/StuccoRoughCast001_COL_2K_METALNESS.png",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "/textures/court/StuccoRoughCast001_NRM_2K_METALNESS.png",
  },
  {
    name: "grassRoughnessTexture",
    type: "texture",
    path: "/textures/court/StuccoRoughCast001_ROUGHNESS_2K_METALNESS.png",
  },
  {
    name: "hdrMap",
    type: "hdr",
    path: "/hdr/Netball Court 2k.hdr",
  },
  {
    name: "mainCharacterModel",
    type: "gltfModel",
    path: "/models/koh/mainCharacter.glb",
  },
  {
    name: "courtModel",
    type: "gltfModel",
    path: "/models/koh/court.glb",
  },
];
