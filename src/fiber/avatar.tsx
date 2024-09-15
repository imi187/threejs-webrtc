
import { useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useRef } from 'react';
import { AnimationAction, AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { playersLive } from './players';

const Avatar = ({ position, userName }: { position: [number, number, number], userName: string }) => {

    const avatarRef = useRef<Group>(null);
    const { scene, animations } = useLoader(GLTFLoader, '/assets/glb/avatar.glb');
    const clonedScene = clone(scene);
    let mixer: AnimationMixer | null = null
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
        mixer.clipAction(animations[6]).setEffectiveTimeScale(1)
    ]


    let currentAction = 1;
    useEffect(() => {
        actions[currentAction].play();
    }, [])


    useFrame((_, delta) => {

        if (playersLive[userName]) {

            console.log(playersLive[userName].animation)
            console.log(currentAction)

            if(actions[currentAction].isRunning() && playersLive[userName].animation !== currentAction) {
                actions[currentAction].stop();
                actions[playersLive[userName].animation].play();
                currentAction = playersLive[userName].animation;
            }
        }

        if (mixer) {
            mixer.update(delta);
        }
    })

    const setAction = () => {
        //actions[1].play();
    }

    return (
        <group ref={avatarRef} position={position} onClick={() => setAction()}>
            <primitive object={clonedScene} ></primitive>
        </group>
    )
}

export default Avatar