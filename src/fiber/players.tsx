import { useRef } from "react";
import Avatar from "./avatar";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import playersStore from "../stores/players-stores";

const Players = ({
  userName,
}: {
  userName: string;
}) => {

  const { players } = playersStore()
  const boxRefs = useRef<{ [s: string]: Mesh | null }>({});

  useFrame(() => {
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
          0.25,
        );
        ref.rotation.y = player.theta / 1000000;
      }
    });
  });

  delete players[userName];

  return (
    <>
      {players &&
        Object.entries(players).map(([key, value]) => (
          <mesh key={key} ref={(ref) => (boxRefs.current[key] = ref)}>
            <Avatar animation={value.animation} ></Avatar>
          </mesh>
        ))}
    </>
  );
};

export default Players;

