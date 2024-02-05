import { OrbitControls, useHelper } from "@react-three/drei";
import { Animal } from "./Animal";
import { Dino } from "./Dino";
import { ZooMap } from "./ZooMap";

import { Fragment, Suspense, useContext, useRef } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import { EditContext } from "../context/EditContext";
import { useFrame, useThree } from "@react-three/fiber";
import { Rtanny } from "./Rtanny";

import * as THREE from "three";

import {
  EffectComposer,
  HueSaturation,
  BrightnessContrast,
  Glitch,
  Noise,
} from "@react-three/postprocessing";

import { BlendFunction, GlitchMode } from "postprocessing";

const START_Y = 20;

export const Environments = () => {
  const { isEditMode, objects, onObjectClicked, onPointMove } =
    useContext(EditContext);
  const { camera } = useThree();
  useFrame(() => {
    if (isEditMode) {
      camera.position.x = 0;
      camera.position.y = 400;
      camera.position.z = 0;
    }
  });

  return (
    <>
      {isEditMode ? (
        <gridHelper
          onPointerMove={onPointMove}
          args={[500, 100]}
          position={[0, START_Y, 0]}
        />
      ) : null}
      <ambientLight intensity={2} />
      <directionalLight
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-right={100}
        shadow-camera-left={-100}
        shadow-mapSize={[5000, 5000]}
        castShadow
        intensity={2}
        position={[162, 10, 102]}
        target-position={[160, 0, 100]}
      />
      <OrbitControls />

      <Suspense>
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody
            name="land"
            friction={2}
            type="fixed"
            colliders={"trimesh"}
          >
            <ZooMap />
          </RigidBody>
          {objects.map(({ id, ...object }) => (
            <Fragment key={id}>
              {object.type === "animal" ? (
                <Animal objectId={id} onClick={onObjectClicked} {...object} />
              ) : (
                <Dino objectId={id} onClick={onObjectClicked} {...object} />
              )}
            </Fragment>
          ))}
          <Rtanny />
        </Physics>
      </Suspense>
    </>
  );
};
