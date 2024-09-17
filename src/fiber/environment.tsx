import { Sky } from "@react-three/drei";

function Environment() {
  const sunSequence = 0.5 * Math.PI;

  return (
    <>
      <ambientLight color={"#FFFFFF"} />
      <directionalLight
        intensity={sunSequence * 1.5}
        castShadow
        position={[-20, 20, -20]}
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
