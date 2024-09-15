import { playersLive, updateLiveData } from "./players";

const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:global.stun.twilio.com:3478",
    },
    {
      username:
        "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      credential: "tE2DajzSJwnsSbc123",
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
    },
    {
      username:
        "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      credential: "tE2DajzSJwnsSbc123",
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
    },
    {
      username:
        "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      credential: "tE2DajzSJwnsSbc123",
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
    },
  ],
});

export async function startConnection(
  name: string,
  setPlayers: (players: string[]) => void,
  setDataChannel: (setDataChannel: RTCDataChannel) => void,
) {
  peerConnection.ondatachannel = function (ev) {
    console.log("peerConnection.ondatachannel event fired.");

    setDataChannel(ev.channel);
    ev.channel.onmessage = function (event) {
      const playersData = JSON.parse(event.data);

      let notFound = false;
      const tempArray: string[] = Object.keys(playersLive);
      Object.keys(playersData).forEach((playerData: string) => {
        if (!tempArray.includes(playerData)) {
          notFound = true;
          tempArray.push(playerData);
        }
      });

      if (notFound) {
        console.log(tempArray);
        setPlayers(tempArray);
      }
      updateLiveData(playersData);
    };
  };

  const offerResponse = await fetch("http://192.168.1.186:3001/offer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelId: name }),
  });

  const offer = await offerResponse.json();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  await fetch("http://192.168.1.186:3001/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: name,
      answer: answer,
    }),
  });
}

export default peerConnection;

