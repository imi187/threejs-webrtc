import { useEffect, useRef, useState } from "react";
import { PointerLockControls } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Spherical, Vector3 } from "three";
import { IPlayer } from "../stores/players-stores";
import DataChannelStore from "../stores/data-channel-store";

const Controls = () => {
  const { dataChannel } = DataChannelStore();
  const controlsRef = useRef<PointerLockControlsImpl | null>(null);
  const { camera } = useThree();
  const dollyBodyRef = useRef<Mesh>(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  let movementTimeout: NodeJS.Timeout;

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseMoving(true);

      clearTimeout(movementTimeout);
      movementTimeout = setTimeout(() => {
        setIsMouseMoving(false);
      }, 10);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(movementTimeout);
    };
  }, []);

  useEffect(() => {
    if (!moveForward && !moveBackward && !moveLeft && !moveRight) {
      if (dataChannel) {
        const direction = new Vector3();
        camera.getWorldDirection(direction);
        const spherical = new Spherical();
        spherical.setFromVector3(direction);
        const player: IPlayer = {
          position: [
            Math.ceil(camera.position.x * 1000000),
            Math.ceil(camera.position.z * 1000000),
          ],
          theta: Math.ceil(spherical.theta * 1000000),
          animation: 2,
        };
        dataChannel.send(JSON.stringify(player));
      }
    }
  }, [moveForward, moveBackward, moveLeft, moveRight, camera, dataChannel]);

  const onKeyDown = function (event: KeyboardEvent) {
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

  const onKeyUp = function (event: KeyboardEvent) {
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
      const velocity = delta * 2;
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
      if (
        moveForward ||
        moveLeft ||
        moveBackward ||
        moveRight ||
        isMouseMoving
      ) {
        if (dataChannel) {
          const direction = new Vector3();
          camera.getWorldDirection(direction);
          const spherical = new Spherical();
          spherical.setFromVector3(direction);
          const player: IPlayer = {
            position: [
              Math.ceil(camera.position.x * 1000000),
              Math.ceil(camera.position.z * 1000000),
            ],
            theta: Math.ceil(spherical.theta * 1000000),
            animation:
              moveForward || moveLeft || moveBackward || moveRight ? 6 : 2,
          };
          dataChannel.send(JSON.stringify(player));
        }
      }
    }

    if (dollyBodyRef.current) {
      dollyBodyRef.current.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z,
      );
      dollyBodyRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <>
      <PointerLockControls
        pointerSpeed={0.15}
        ref={controlsRef}
        enabled={dataChannel ? true : false}
      />
      <mesh ref={dollyBodyRef}>
        <mesh position={[0, 0, -0.25]}>
          <boxGeometry args={[0.001, 0.001, 0.001]} />
        </mesh>
      </mesh>
    </>
  );
};

export default Controls;
