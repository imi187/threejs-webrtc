
import { useState } from "react"
import Avatar from "./avatar";

const Players = () => {

    const [players, setPlayers] = useState<{ [s: string]: [number, number] }>();
    
    /*useEffect(() => {
        dataChannel.onmessage = function (event) {
            let multiCoordinates = JSON.parse(event.data);
            delete multiCoordinates[userName];
            setPlayers(multiCoordinates)
        };

    }, [dataChannel]);*/

    return (
        <>
            {players && Object.entries(players).map(([key, value]) => (
                <Avatar key={key} position={[value[0] / 1000000, 0, value[1] / 1000000]}></Avatar>
            ))}
        </>
    )

}

export default Players