import React, { useRef } from "react";
import Avatar from "./avatar";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export interface iPlayer {
  position: [number, number];
  theta: number;
  animation: number;
}

export interface iPlayers {
  [s: string]: iPlayer;
}

export let playersLive: iPlayers = {};
export function updateLiveData(newData: iPlayers) {
  playersLive = newData;
}

const Players = ({
  players,
  userName,
}: {
  players: string[];
  userName: string;
}) => {
  const boxRefs = useRef<{ [s: string]: Mesh | null }>({});
  useFrame(() => {
    Object.keys(playersLive).forEach((playerKey) => {
      const player = playersLive[playerKey];
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

  return (
    <>
      {players &&
        Object.entries(players).map(([_, value]) => (
          <React.Fragment key={value}>
            {userName !== value ? (
              <mesh ref={(ref) => (boxRefs.current[value] = ref)}>
                <Avatar userName={value} position={[0, 0, 0]}></Avatar>
              </mesh>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
    </>
  );
};

export default Players;

