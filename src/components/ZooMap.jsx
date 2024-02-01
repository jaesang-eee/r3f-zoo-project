import { useFBX } from "@react-three/drei";

export const ZooMap = () => {
  const fbx = useFBX(`/models/map/zoo.FBX`);
  fbx.traverse((obj) => {
    if (obj.isMesh) {
      obj.receiveShadow = true;
      obj.castShadow = true;
    }
  });
  return (
    <group>
      <primitive position={[-50, -22, 0]} object={fbx}></primitive>
    </group>
  );
};
