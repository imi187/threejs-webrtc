import { Sky } from "@react-three/drei";

function Environment() {
  const sunSequence = 0.5 * Math.PI;

  return (
    <>
      <ambientLight color={"#FFFFFF"} />
      <directionalLight
        shadow-mapSize-width={2048 * 2 }
        shadow-mapSize-height={2048 * 2}
        intensity={sunSequence * 1.5}
        castShadow
        position={[0, 100, -0]}
        shadow-bias={-0.00001}
        shadow-normalBias={0.001}
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
    </>
  );
}

export default Environment;
