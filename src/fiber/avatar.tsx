import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { useCylinder } from "@react-three/cannon";
import { IPlayer } from "../stores/players-stores";

//https://bigsoundbank.com/search?q=Walking
//https://freesound.org/
//https://www.mediamusiccomposer.com/blog/10-best-places-to-download-free-royalty-free-game-sound-effects

const Avatar = ({ player, animation }: { player: IPlayer, animation: number }) => {
  const boxRefs = useRef<THREE.Mesh>(null);
  const avatarRef = useRef<Group>(null);
  const { scene, animations } = useLoader(GLTFLoader, "/assets/glb/avatar.glb");

  const audioRef = useRef<THREE.PositionalAudio>(null!);

  const [boundingBoxRef, api] = useCylinder<THREE.Mesh>(() => ({
    mass: 65,
    position: [0, 0.3, 0],
    fixedRotation: true,
    linearFactor: [0, 1, 0],
    args:[0.1, 0.1, 1, 32]
  }));

  const posBoundingBox = useRef([0, 0, 0])


  const [clonedScene, actions] = useMemo(() => {
    const clonedScene = clone(scene);
    clonedScene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
      object.frustumCulled = false;
    });
    const mixer = new AnimationMixer(clonedScene);
    const actions = [
      mixer.clipAction(animations[0]),
      mixer.clipAction(animations[1]),
      mixer.clipAction(animations[2]),
      mixer.clipAction(animations[3]),
      mixer.clipAction(animations[4]),
      mixer.clipAction(animations[5]),
      mixer.clipAction(animations[6]),
    ];

    return [clonedScene, actions];
  }, [scene, animations]);

  useEffect(() => {

    api.position.subscribe(v => posBoundingBox.current = v);

    api.material.set({
      friction: 10,
      restitution: 0,
    });

    let currentRunning = 0;
    actions.forEach((action, index) => {
      if (action.isRunning()) {
        currentRunning = index;
      }
    });
    const startAction = actions[currentRunning];
    const endAction = actions[animation];
    if (currentRunning !== animation) {
      if (endAction) {
        endAction.enabled = true;
        endAction.setEffectiveTimeScale(1);
        endAction.setEffectiveWeight(1);
        endAction.time = 0;
        if (startAction) {
          startAction.crossFadeTo(endAction, 0.2, true);
        } else {
          endAction.fadeIn(0.2);
        }
      } else {
        startAction.fadeOut(0.2);
      }
      endAction.play();
    }

    if (animation === 6) {
      audioRef.current.play();
    } else {
      audioRef.current.stop();
    }
  }, [animation, actions]);


  useEffect(() => {
    api.position.set(player.position[0] / 1000000, posBoundingBox.current[1], player.position[1] / 1000000);
  }, [player])

  useFrame((_, delta) => {

    if (boxRefs.current) {
      boxRefs.current.position.lerp(
        {
          x: player.position[0] / 1000000,
          y: posBoundingBox.current[1] -0.5,
          z: player.position[1] / 1000000,
        },
        0.18,
      );
      boxRefs.current.rotation.y = player.theta / 1000000;

    }

    if (actions[animation] && actions[animation].getMixer()) {
      actions[animation].getMixer().update(delta);
    }
  });

  return (
    <>
      <mesh ref={boxRefs}>
        <group ref={avatarRef} castShadow>
          <primitive object={clonedScene}></primitive>
          <PositionalAudio
            ref={audioRef}
            url="/assets/sounds/walking_cement_path_soft_shoe.wav"
            distance={5}
            autoplay={true}
            isPlaying={false}
            loop
            playbackRate={1.1}
          />
        </group>
      </mesh>
      <mesh ref={boundingBoxRef} visible={false}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
      </mesh>
    </>
  );
};

export default Avatar;
