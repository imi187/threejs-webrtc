import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AnimationMixer, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import playersStore from "../stores/players-stores";

const Avatar = ({ userName }: { userName: string }) => {
  const { players } = playersStore()

  const avatarRef = useRef<Group>(null);
  const { scene, animations } = useLoader(GLTFLoader, "/assets/glb/avatar.glb");
  const clonedScene = clone(scene);
  let mixer: AnimationMixer | null = null;
  mixer = new AnimationMixer(scene);
  mixer.timeScale = 1;
  mixer = new AnimationMixer(clonedScene);
  const actions = [
    mixer.clipAction(animations[0]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[1]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[2]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[3]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[4]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[5]).setEffectiveTimeScale(1),
    mixer.clipAction(animations[6]).setEffectiveTimeScale(1),
  ];

  let currentActionNumber = 1;
  useEffect(() => {
    actions[currentActionNumber].play();
  }, []);

  useFrame((_, delta) => {
    if (players[userName]) {
      if (
        actions[currentActionNumber].isRunning() &&
        players[userName].animation !== currentActionNumber
      ) {
        actions[currentActionNumber].stop();
        actions[players[userName].animation].play();
        currentActionNumber = players[userName].animation;
      }
    }
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <group ref={avatarRef}>
      <primitive object={clonedScene}></primitive>
    </group>
  );
};

export default Avatar;
