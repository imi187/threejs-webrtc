import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { PositionalAudio } from '@react-three/drei'
import * as THREE from 'three';

//https://bigsoundbank.com/search?q=Walking
//https://freesound.org/
//https://www.mediamusiccomposer.com/blog/10-best-places-to-download-free-royalty-free-game-sound-effects

const Avatar = ({ animation }: { animation: number }) => {
  const avatarRef = useRef<Group>(null);
  const { scene, animations } = useLoader(GLTFLoader, "/assets/glb/avatar.glb");

  const audioRef = useRef<THREE.PositionalAudio>(null!);

  const [clonedScene, actions] = useMemo(() => {
    const clonedScene = clone(scene);
    clonedScene.traverse((object: any) => {

      object.castShadow = object.isMesh ? true : false
      object.receiveShadow = object.isMesh ? true : false
      object.frustumCulled = false

    })
    const mixer = new AnimationMixer(clonedScene);
    const actions = [
      mixer.clipAction(animations[0]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[1]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[2]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[3]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[4]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[5]).setEffectiveTimeScale(1),
      mixer.clipAction(animations[6]).setEffectiveTimeScale(1),
    ];

    return [clonedScene, actions];
  }, [scene, animations]);

  useEffect(() => {
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
      audioRef.current.play()
    } else {
      audioRef.current.stop()
    }

  }, [animation, actions]);

  useFrame((_, delta) => {
    if (actions[animation] && actions[animation].getMixer()) {
      actions[animation].getMixer().update(delta);
    }
  });

  return (
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
  );
};

export default Avatar;
