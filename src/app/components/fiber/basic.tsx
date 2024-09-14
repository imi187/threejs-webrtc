"use client";

import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap, ACESFilmicToneMapping } from "three";
import { AdaptiveDpr, Stats } from "@react-three/drei";
import Controls from "./controls";
import Cube from "./cube";
import { Sky } from "@react-three/drei"

export default function Basic() {

  const sunSequence = 0.50 * Math.PI


  return (
    <>
      <Canvas
        style={{ position: "absolute" }}
        linear
        shadows
        camera={{ fov: 50, position: [0, 1.75, 0] }}
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
        <Stats className="stats" />
        <ambientLight 
          color={"#FFFFFF"}
        />

        <directionalLight
        intensity={sunSequence * 1.5}
          castShadow 
          position={[
            -20,
            20,
            -20,
          ]}
         >
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
        </directionalLight>
        <Sky
          distance={450000}
          azimuth={0.25}
          sunPosition={[
            -Math.sin(sunSequence) / 100,
            Math.sin(sunSequence) / 100,
            Math.cos(sunSequence) / 100,
          ]}
          inclination={0}
          mieCoefficient={0.07}
          mieDirectionalG={0.999}
          rayleigh={3}
          turbidity={20}
        />
        <Cube />
        <Controls />
        {/*<axesHelper />*/}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial roughness={0} metalness={0.5} depthTest={true} depthWrite={true} emissive={"#000000"} color={"#049ef4"} />
        </mesh>
        <AdaptiveDpr pixelated />
      </Canvas>
    </>
  );
}
