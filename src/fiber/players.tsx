
import React, { useRef } from "react";
import Avatar from "./avatar";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export interface iPlayers {
    [s: string]: [number, number]
}

export let playersLive: iPlayers = {}
export function updateLiveData(newData: iPlayers) {
    playersLive = newData;
}

const Players = ({ players, userName }: { players: string[], userName: string }) => {

    const boxRefs = useRef<{ [s: string]: Mesh | null }>({});

    //const [players, setPlayers] = useState<{ [s: string]: [number, number] }>();

    /*useEffect(() => {
        dataChannel.onmessage = function (event) {
            let multiCoordinates = JSON.parse(event.data);
            delete multiCoordinates[userName];
            setPlayers(multiCoordinates)
        };

    }, [dataChannel]);*/


    useFrame(() => {
        // Loop over alle spelers in liveData en update hun positie
        Object.keys(playersLive).forEach((playerKey) => {
            const player = playersLive[playerKey];
            const ref = boxRefs.current[playerKey];

            //console.log(player[0])
            //console.log(player[1])
            if (ref) {
                ref.position.lerp(
                    { x: player[0] / 1000000, y: 0, z: player[1] / 1000000 },
                    0.25 // Lerp factor to control the speed of interpolation
                );

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