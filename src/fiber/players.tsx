import { Suspense, useRef } from "react";
import Avatar from "./avatar";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import playersStore from "../stores/players-stores";

const Players = () => {
  const { players } = playersStore();
  //const boxRefs = useRef<{ [s: string]: Mesh | null }>({});

  /*useFrame(() => {
    Object.keys(players).forEach((playerKey) => {
      const player = players[playerKey];
      const ref = boxRefs.current[playerKey];
      if (ref) {
        ref.position.lerp(
          {
            x: player.position[0] / 1000000,
            y: 0,
            z: player.position[1] / 1000000,
          },
          0.18,
        );
        ref.rotation.y = player.theta / 1000000;
      }
    });
  });*/

  return (
    <>
      {players &&
        Object.entries(players).map(([key, value]) => (
          <Suspense fallback={null} key={key}>
            <mesh key={key} >
              <Avatar player={value} animation={value.animation}></Avatar>
            </mesh>
          </Suspense>
        ))}
    </>
  );
};

export default Players;
