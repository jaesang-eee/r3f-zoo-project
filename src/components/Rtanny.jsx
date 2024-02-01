import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useContext, useEffect, useRef, useState } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Controls } from "../App";
import { EditContext } from "../context/EditContext";

const JUMP_FORCE = 10;
const MOVEMENT_SPEED = 2;
const MAX_VEL = 10;

const offest = {
  x: 160,
  y: 10,
  z: 100,
};

export const Rtanny = () => {
  const group = useRef();
  const body = useRef();
  const rtannyRef = useRef();

  const [animation, setAnimation] = useState("Idle");
  const { scene, animations } = useGLTF(`/models/rtanny.glb`);
  const { actions } = useAnimations(animations, group);
  const { isEditMode, selectedId } = useContext(EditContext);
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
    }
  });
  useEffect(() => {
    actions[animation].reset().play();

    return () => actions[animation].fadeOut();
  }, [scene, animation]);

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );

  const isOnLand = useRef(false);

  const isKeyPressed =
    leftPressed || rightPressed || backPressed || forwardPressed;

  useFrame((state) => {
    if (isEditMode) return;
    if (selectedId) return;

    const { x, y, z } = group.current.children[0].position;
    const realX = offest.x + x;
    const realY = offest.y + y;
    const realZ = offest.z + z;

    state.camera.position.x = realX;
    state.camera.position.y = realY + 40;
    state.camera.position.z = realZ + 60;

    state.camera.lookAt(realX, realY, realZ);

    const impulse = { x: 0, y: 0, z: 0 };

    if (jumpPressed && isOnLand.current) {
      impulse.y += JUMP_FORCE;
    }

    const linvel = body.current.linvel();
    let changeRotation = false;
    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED;
      changeRotation = true;
    }
    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED;
      changeRotation = true;
    }

    body.current.applyImpulse(impulse, true);
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      rtannyRef.current.rotation.y = angle;
    }
    if (isKeyPressed) {
      setAnimation("Walk");
    } else {
      setAnimation("Idle");
    }
  });

  return (
    <group ref={group} position={[offest.x, offest.y, offest.z]}>
      <RigidBody
        ref={body}
        colliders={false}
        enabledRotations={[false, false, false]}
        onCollisionEnter={(e) => {
          if (e.other.rigidBodyObject.name === "land") {
            isOnLand.current = true;
          }
        }}
        onCollisionExit={(e) => {
          if (e.other.rigidBodyObject.name === "land") {
            isOnLand.current = false;
          }
        }}
      >
        <group ref={rtannyRef}>
          <primitive object={scene}></primitive>
          <CapsuleCollider args={[1, 0.7]} position={[0, 1.5, 0]} />
        </group>
      </RigidBody>
    </group>
  );
};
