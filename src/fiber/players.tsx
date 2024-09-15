
import { useRef } from "react";
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

const Players = ({ players }: { players: string[] }) => {

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
    
            console.log(player[0])
            console.log(player[1])


          if (ref) {
            ref.position.x = player[0]/1000000;
            ref.position.z = player[1]/1000000;
          }
        });
      });



    console.log("test")

    let i = 0;
    return (
        <>
            {players && Object.entries(players).map(([key, value]) => {
                i++; return (
                    <mesh key={value} ref={(ref) => (boxRefs.current[value] = ref)}>
                        <Avatar position={[i, 0, i]}></Avatar>
                    </mesh>
                )
            })}
        </>
    )

}

export default Players