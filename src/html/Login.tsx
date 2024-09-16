import { useEffect, useState } from "react";
import startWebRPCConnection from "./RTCPeerConnectionStatic";
import playersStore, { IPlayers } from "../stores/players-stores";
import DataChannelStore from "../stores/data-channel-store";

interface IIceCandidate {
  candidate: string,
  sdpMLineIndex: number,
  sdpMid: string
}

function Login({
  setUserNameState,
}: {
  setUserNameState: (userName: string) => void;
}) {

  const [userName, setUserName] = useState("");
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const { setPlayers } = playersStore();
  const { setDataChannel } = DataChannelStore();

  function start() {

    if (peerConnection) {
      setUserNameState(userName);

      const ws = new WebSocket("ws://192.168.1.186:3001/ws");
      ws.onopen = function () {
        startWebRPCConnection(peerConnection, userName);
      };

      ws.onmessage = function (e) {
        const json: IIceCandidate = JSON.parse(e.data);
        console.log('ICECANDIDATES');
        setTimeout(() => {
          peerConnection.addIceCandidate(new RTCIceCandidate(json)).catch((e) => {
            console.error(e);
          });
        }, 1000);
      };

      peerConnection.ondatachannel = function (ev) {
        console.log("peerConnection.ondatachannel event fired.");
        setDataChannel(ev.channel)
        ev.channel.onmessage = function (event) {
          const playersData: IPlayers = JSON.parse(event.data);
          setPlayers(playersData);
        };
      };
    }
  }

  useEffect(() => {
    if (!peerConnection) {
      setPeerConnection(new RTCPeerConnection());
    }
  }, [peerConnection]);
  
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 99999,
        right: 0,
        backgroundColor: "green",
        padding: "10px",
      }}
    >
      <input
        name="userName"
        value={userName}
        style={{ color: "black" }}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <button
        onClick={start}
        style={{ backgroundColor: "black", padding: "0 10px" }}
      >
        Start
      </button>
    </div>
  );
}

export default Login;

