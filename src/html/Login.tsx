import { useState } from "react";
import peerConnection, { startConnection } from "../fiber/RTCPeerConnectionStatic";

function Login({setPlayers, setDataChannel}: {setPlayers: (players: string[]) => void, setDataChannel: (dataChannel: RTCDataChannel) => void}) {

    const [userName, setUserName] = useState('');

    function start() {
        const ws = new WebSocket("ws://192.168.1.186:3001/ws");
        ws.onopen = function () {
            startConnection(userName, setPlayers, setDataChannel);
        };

        ws.onmessage = function (e) {
            let json = JSON.parse(e.data);
            setTimeout(() => {
                peerConnection.addIceCandidate(new RTCIceCandidate(json))
                    .catch((e) => {
                        console.error(e);
                    });
            }, 1000);
        };
    }

    return <div style={{
        position: 'fixed',
        zIndex: 99999,
        right: 0,
        backgroundColor: 'green',
        padding: '10px'
    }}>
        <input name='userName' value={userName} style={{ color: 'black' }} onChange={(e) => {
            e.target.value
            setUserName(e.target.value);
        }} />
        <button
            onClick={() => {
                start()
            }}
            style={{ backgroundColor: 'black', padding: '0 10px', }}
        >Start</button>
    </div>
}

export default Login;