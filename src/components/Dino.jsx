import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useContext } from "react";
import { SkeletonUtils } from "three-stdlib";
import { EditContext } from "../context/EditContext";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

export const Dino = ({ name, objectId, position, onClick, ...props }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(`/models/dinos/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[`Armature|${name}_Idle`].reset().play();
  }, []);

  const { isEditMode, draggedPosition, selectedId } = useContext(EditContext);
  const isSelected = objectId === selectedId;

  useFrame((state) => {
    if (isSelected && !isEditMode) {
      const [offestX, offestY, offsetZ] = position;

      const { x, y, z } = group.current.children[0].position;
      const realX = offestX + x;
      const realY = offestY + y;
      const realZ = offsetZ + z;

      state.camera.lookAt(realX, realY, realZ);

      state.camera.position.lerp(
        new THREE.Vector3(realX, realY + 20, realZ + 40),
        0.01
      );
    }
  });

  return (
    <>
      {isEditMode ? (
        <group
          scale={[1.5, 1.5, 1.5]}
          position={isSelected ? draggedPosition : position}
          onClick={onClick(objectId)}
          {...props}
          ref={group}
        >
          <mesh>
            <boxGeometry args={[6, 1, 8]} />
            <meshBasicMaterial transparent opacity={0.7} color={"green"} />
          </mesh>
          <primitive object={clone}></primitive>;
        </group>
      ) : (
        <group position={position} ref={group}>
          <RigidBody
            {...props}
            colliders={"hull"}
            enabledRotations={[false, false, false]}
          >
            <group onClick={onClick(objectId)}>
              <primitive object={clone}></primitive>;
            </group>
          </RigidBody>
        </group>
      )}
    </>
  );
};
