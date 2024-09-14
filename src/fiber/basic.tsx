"use client";

import { Canvas } from "@react-three/fiber";
import { PCFSoftShadowMap, ACESFilmicToneMapping } from "three";
import { AdaptiveDpr, Stats, useGLTF } from "@react-three/drei";
import Controls from "./controls";
import { Sky } from "@react-three/drei";
import { useState } from "react";
import peerConnection from "./RTCPeerConnectionStatic";
import Players from "./players";

useGLTF.preload('/assets/glb/avatar.glb')

export default function Basic() {
  const sunSequence = 0.5 * Math.PI;

  const [userName, setUserName] = useState('')
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null)


  async function startConnection(name: string) {

    peerConnection.ondatachannel = function (ev) {
      console.log("peerConnection.ondatachannel event fired.");

      ev.channel.onmessage = function (event) {
        let multiCoordinates = JSON.parse(event.data);

        console.log(multiCoordinates);

      };

      setDataChannel(ev.channel);

    };

    const offerResponse = await fetch("http://192.168.1.186:3001/offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId: name }),
    });
    const offer = await offerResponse.json();
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer),
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    await fetch("http://192.168.1.186:3001/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId: userName,
        answer: answer
      }),
    });
  }

  function start() {
    const ws = new WebSocket("ws://192.168.1.186:3001/ws");
    ws.onopen = function (e) {
      startConnection(userName);
    };

    ws.onmessage = function (e) {
      let json = JSON.parse(e.data);
      setTimeout(() => {
        console.log(json)
        peerConnection.addIceCandidate(new RTCIceCandidate(json))
          .catch((e) => {
            console.error(e);
          });
      }, 1000);
    };
  }

  return (
    <>
      <div style={{
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

      <Canvas
        style={{ position: "fixed", zIndex: 100 }}
        linear
        shadows
        camera={{ fov: 50, position: [3, 1.75, 3] }}
        gl={{
          //powerPreference: "high-performance",
          autoClearColor: true,
          antialias: true,
          alpha: true,
          shadowMapEnabled: true,
          shadowMapType: PCFSoftShadowMap,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >

        <Stats className="stats" />
        <ambientLight color={"#FFFFFF"} />

        <directionalLight
          intensity={sunSequence * 1.5}
          castShadow
          position={[-20, 20, -20]}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, 10, -10]}
          />
        </directionalLight>
        <Sky
          distance={450000}
          azimuth={0.25}
          sunPosition={[
            -Math.sin(sunSequence) / 100,
            Math.sin(sunSequence) / 100,
            Math.cos(sunSequence) / 100,
          ]}
          inclination={0}
          mieCoefficient={0.07}
          mieDirectionalG={0.999}
          rayleigh={3}
          turbidity={20}
        />

        {dataChannel &&
          <Controls dataChannel={dataChannel} />
        }

        {dataChannel &&
          <Players userName={userName} dataChannel={dataChannel} />
        }

        {/*<axesHelper />*/}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            roughness={0}
            metalness={0.5}
            depthTest={true}
            depthWrite={true}
            emissive={"#000000"}
            color={"#049ef4"}
          />
        </mesh>
        <AdaptiveDpr pixelated />
      </Canvas>
    </>
  );
}
