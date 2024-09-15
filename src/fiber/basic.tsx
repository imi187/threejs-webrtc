"use client";

import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap, ACESFilmicToneMapping } from "three";
import { AdaptiveDpr, Stats, useGLTF } from "@react-three/drei";
import Environment from "./environment";
import Login from "../html/Login";
import Players, { iPlayers } from "./players";
import { useState } from "react";
import Controls from "./controls";

useGLTF.preload('/assets/glb/avatar.glb')

export default function Basic() {

  const [players, setPlayers] = useState<string[]>([])
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null)

  return (
    <>
      <Login setPlayers={setPlayers} setDataChannel={setDataChannel} />
      <Canvas
        style={{ position: "fixed", zIndex: 100 }}
        linear
        shadows
        camera={{ fov: 50, position: [3, 1.75, 3] }}
        gl={{
          //powerPreference: "high-performance",
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
        {dataChannel &&
          <Controls dataChannel={dataChannel} />
        }

        <Players players={players} />
        <Stats className="stats" />
        {/*<axesHelper />*/}

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            roughness={0}
            metalness={0.5}
            depthTest={true}
            depthWrite={true}
            emissive={"#000000"}
            color={"#049ef4"}
          />
        </mesh>
        <AdaptiveDpr pixelated />
      </Canvas>
    </>
  );
}
