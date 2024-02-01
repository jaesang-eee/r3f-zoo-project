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

  const lightRef = useRef();
  useHelper(lightRef, THREE.DirectionalLightHelper);
  return (
    <>
      {isEditMode ? (
        <gridHelper
          onPointerMove={onPointMove}
          args={[500, 100]}
          position={[0, START_Y, 0]}
        />
      ) : null}
      <ambientLight intensity={4} />
      <directionalLight
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-right={100}
        shadow-camera-left={-100}
        shadow-mapSize={[5000, 5000]}
        ref={lightRef}
        castShadow
        intensity={4}
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

      <EffectComposer>
        <HueSaturation
          blendFunction={BlendFunction.NORMAL}
          hue={0}
          saturation={0}
        />
        <BrightnessContrast
          brightness={-0.1} // brightness. min: -1, max: 1
          contrast={0.2} // contrast: min -1, max: 1
        />
        {isEditMode ? (
          <Noise
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.ADD} // blend mode
          />
        ) : null}
      </EffectComposer>
    </>
  );
};
