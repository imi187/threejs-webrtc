
import React, { useRef } from "react";
import Avatar from "./avatar";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export interface iPlayers {
    [s: string]: [number, number, number]
}

export let playersLive: iPlayers = {}
export function updateLiveData(newData: iPlayers) {
    playersLive = newData;
}

const Players = ({ players, userName }: { players: string[], userName: string }) => {

    const boxRefs = useRef<{ [s: string]: Mesh | null }>({});
    useFrame(() => {
        
        Object.keys(playersLive).forEach((playerKey) => {
            const player = playersLive[playerKey];
            const ref = boxRefs.current[playerKey];
            if (ref) {
                ref.position.lerp(
                    { x: player[0] / 1000000, y: 0, z: player[1] / 1000000 },
                    0.25
                );
                ref.rotation.y = player[2] / 1000000
            }
        });
    });

    return (
        <>
            {players && Object.entries(players).map(([key, value]) =>
                <React.Fragment key={value} >
                    {userName !== value ? <mesh ref={(ref) => (boxRefs.current[value] = ref)}>
                        <Avatar position={[0, 0, 0]}></Avatar>
                    </mesh> : <></>}
                </React.Fragment>
            )}
        </>
    )

}

export default Players