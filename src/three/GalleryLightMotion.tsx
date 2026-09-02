import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function GalleryLightMotion(){
  const key=useRef<THREE.PointLight>(null!)
  const rim=useRef<THREE.PointLight>(null!)
  useFrame(({clock})=>{
    const t=clock.elapsedTime*.08
    if(key.current){
      key.current.position.x=Math.cos(t)*4.4
      key.current.position.z=3.5+Math.sin(t)*1.2
    }
    if(rim.current){
      rim.current.position.y=2.5+Math.sin(t*.8)*.7
      rim.current.position.x=-3.8+Math.cos(t*.7)*.8
    }
  })
  return <>
    <pointLight ref={key} position={[4,3,4]} intensity={.42} distance={11}/>
    <pointLight ref={rim} position={[-4,3,-2]} intensity={.22} distance={10}/>
  </>
}
