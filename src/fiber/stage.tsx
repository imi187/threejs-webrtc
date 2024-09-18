"use client";

import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap, ACESFilmicToneMapping, Mesh } from "three";
import { AdaptiveDpr, Stats, useGLTF } from "@react-three/drei";
import Environment from "./environment";
import Login from "../html/Login";
import Players from "./players";
import { Suspense, useEffect, useState } from "react";
import Controls from "./controls";
import { useBox, Physics, useSphere } from '@react-three/cannon';


useGLTF.preload("/assets/glb/avatar.glb");


const Player = () => {
  // Specify that ref is a reference to a THREE.Mesh
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 2,
    position: [0, 5, 0],
    args: [0.2],
    type: 'Dynamic',
  }));

  useEffect(() => {
    api.material.set({
      friction: 0, // Wrijving instellen
      restitution: 0.9, // Terugkaatsing instellen voor dit specifieke object
    });
  }, [api]);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 64, 64]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};



const Ground = () => {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 0,
    position: [0, -0.5, 0],
    args: [10, 1, 10],
  }));

  useEffect(() => {
    api.material.set({
      friction: 0, // Wrijving instellen
      restitution: 0.9, // Terugkaatsing instellen voor dit specifieke object
    });
  }, [api]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow ref={ref}>
      <boxGeometry args={[23, 1, 23]} />
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


export default function Stage() {
  const [userName, setUserName] = useState<string | null>(null);


  return (
    <>
      <Login setUserNameState={setUserName} />
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
        <Controls />

        {userName && <Players userName={userName} />}

        <Stats className="stats" />
        {/*<axesHelper />*/}

        <Suspense fallback={null}>
          <Physics
            iterations={60}
            tolerance={0.0001}
            gravity={[0, -9.8, 0]}
          >
            <Player />
            <Ground />
          </Physics>
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </>
  );
}

