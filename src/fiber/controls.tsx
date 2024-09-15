import {
  useEffect,
  useRef,
  useState,
} from "react";
import { PointerLockControls } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh } from "three";

const Controls = ({dataChannel}: {dataChannel: RTCDataChannel}) => {
  const controlsRef = useRef<PointerLockControlsImpl | null>(null);
  const {camera} = useThree()
  const dollyBodyRef = useRef<Mesh>(null);
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp);
  }, []);

  const onKeyDown = function (event: any) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        setMoveForward(true);
        break;

      case "ArrowLeft":
      case "KeyA":
        setMoveLeft(true);
        break;

      case "ArrowDown":
      case "KeyS":
        setMoveBackward(true);
        break;

      case "ArrowRight":
      case "KeyD":
        setMoveRight(true);
        break;
      default:
        return;
    }
  };

  const onKeyUp = function (event: any) {
    switch (event.code) {
      case "z":
      case "KeyW":
        setMoveForward(false);
        break;

      case "q":
      case "KeyA":
        setMoveLeft(false);
        break;

      case "s":
      case "KeyS":
        setMoveBackward(false);
        break;

      case "d":
      case "KeyD":
        setMoveRight(false);
        break;

      default:
        return;
    }
  };

  useFrame((scene, delta) => {

    if (controlsRef.current) {
      const velocity = delta *2;
      if (moveForward) {
        controlsRef.current.moveForward(velocity);
      }
      if (moveLeft) {
        controlsRef.current.moveRight(-velocity);
      }
      if (moveBackward) {
        controlsRef.current.moveForward(-velocity);
      }
      if (moveRight) {
        controlsRef.current.moveRight(velocity);
      }
      if(moveForward || moveLeft || moveBackward || moveRight) {
        if(dataChannel) {
          dataChannel.send(JSON.stringify([Math.ceil(camera.position.x * 1000000), Math.ceil(camera.position.z * 1000000)]));
        }
      }
    }

    if(dollyBodyRef.current) {
      dollyBodyRef.current.position.set(camera.position.x, camera.position.y, camera.position.z);
      dollyBodyRef.current.quaternion.copy(camera.quaternion);
    }

  });

  return <>
    <PointerLockControls pointerSpeed={0.15} ref={controlsRef} enabled={true} />
    <mesh ref={dollyBodyRef} >
      <mesh position={[0,0,-0.25]}>
        <boxGeometry args={[0.001,0.001,0.001]} />
      </mesh>
    </mesh>
  </>
};

export default Controls;
