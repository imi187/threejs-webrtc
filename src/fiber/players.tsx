import { Suspense } from "react";
import Avatar from "./avatar";
import playersStore from "../stores/players-stores";

const Players = () => {
  const { players } = playersStore();
  return (
    <>
      {players &&
        Object.entries(players).map(([key, value]) => (
          <Suspense fallback={null} key={key}>
            <mesh key={key}>
              <Avatar player={value} animation={value.animation}></Avatar>
            </mesh>
          </Suspense>
        ))}
    </>
  );
};

export default Players;
