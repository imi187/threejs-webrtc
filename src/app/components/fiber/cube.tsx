import React, { useState } from "react";

interface ReflectiveCubeProps {
  position: [number, number, number];
}

const ReflectiveCube: React.FC<ReflectiveCubeProps> = ({ position }) => {
  const [onHover, setOnHover] = useState(false)
  return (
    <>
      <mesh position={position} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={onHover ? "blue" : "yellow"}  />
      </mesh>
    </>
  );
};

export default function Cube() {  
  return (
    <>
      <ReflectiveCube
        position={[0, 1, 0]}
      />
    </>
  );
}
