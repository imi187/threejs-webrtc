
import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react';
import { AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const Avatar = ({ position }: { position: [number, number, number] }) => {

    const avatarRef = useRef<Group>(null);
    const { scene } = useLoader(GLTFLoader, '/assets/glb/avatar.glb');
    const clonedScene = clone(scene);
    //const animations = clonedScene.animations;
    let mixer: AnimationMixer | null = null
    mixer = new AnimationMixer(scene)
    mixer.timeScale = 1

    useFrame((_, delta) => {
        if (mixer) {
            mixer.update(delta)
        }
    })

    /*const setAction = (event: ThreeEvent<MouseEvent>) => {
        let startAction = animations[6];
        mixer = new AnimationMixer(scene)
        const action = mixer.clipAction(startAction)
        action.setEffectiveTimeScale(1)
        action.play();
    }*/

    return (    
        <group ref={avatarRef} position={position}>
            <primitive object={clonedScene} ></primitive>
        </group>
    )
}

export default Avatar