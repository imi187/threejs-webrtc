import { channel } from "diagnostics_channel";

export async function startWebRPCConnection(
  peerConnection: RTCPeerConnection,
  name: string,
  ws: WebSocket
) {
  peerConnection.setConfiguration({
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
  ws.send(JSON.stringify({ action: 'offer', channelId: name, data: {type: '', sdp: ''} }));
}

export default startWebRPCConnection;

