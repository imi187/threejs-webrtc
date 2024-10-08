"use client";

import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap, ACESFilmicToneMapping, Mesh } from "three";
import { AdaptiveDpr, Stats, useGLTF } from "@react-three/drei";
import Environment from "./environment";
import Login from "../html/Login";
import Players from "./players";
import { Suspense, useEffect, useState } from "react";
import Controls from "./controls";
import { useBox, Physics } from '@react-three/cannon';

useGLTF.preload("/assets/glb/avatar.glb");

function Ramp() {
  const [ref] = useBox<Mesh>(() => ({
    mass: 0,
    position: [3, 0, 3],
    rotation: [-Math.PI / 6, 0, 0],
    args: [5, 0.2, 10],
  }));

  return (
    <mesh castShadow receiveShadow ref={ref} position={[3, 0, 3]}>
      <boxGeometry args={[5, 0.2, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

const Ground = () => {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 0,
    position: [0, -0.5, 0],
    args: [100, 1, 100],
  }));

  useEffect(() => {
    api.material.set({
      friction: 0,
      restitution: 0,
    });
  }, [api]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow ref={ref}>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial
        roughness={0}
        metalness={0.5}
        depthTest={true}
        depthWrite={true}
        emissive={"#000000"}
        color={"#049ef4"}
      />
    </mesh>
  );
};


const Wall = () => {
  const [ref] = useBox<Mesh>(() => ({
    mass: 0,
    position: [-5, 0, -5],
    rotation: [0, 0, 0],
    args: [1, 3, 10],
  }));

  return (
    <mesh castShadow receiveShadow ref={ref} position={[-5, 0, -5]}>
      <boxGeometry args={[1, 3, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};


export default function Stage() {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <>
      <Login setUserNameState={setUserName} />
      {userName &&
        <Canvas
          style={{ position: "fixed", zIndex: 100 }}
          linear
          shadows
          camera={{ fov: 50, position: [3, 1.75, 3] }}
          gl={{
            autoClearColor: true,
            antialias: true,
            alpha: true,
            shadowMapEnabled: true,
            shadowMapType: PCFSoftShadowMap,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1,
          }}
        >
          <Environment />
          <Stats className="stats" />
          {/*<axesHelper />*/}
          <Suspense fallback={null}>
            <Physics
              iterations={100}
              tolerance={0.0001}
              gravity={[0, -9.8, 0]}
            >
              <Controls />
              <Players />
              <Ramp />
              <Ground />

              <Wall />
            </Physics>
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
      }
    </>
  );
}