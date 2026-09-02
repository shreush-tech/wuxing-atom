import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function ElementFocusHalo({active=false}:{active?:boolean}){
  const ref=useRef<THREE.Mesh>(null!)
  useFrame(({clock})=>{
    if(!ref.current)return
    ref.current.visible=active
    if(!active)return
    const s=1+Math.sin(clock.elapsedTime*.8)*.035
    ref.current.scale.setScalar(s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity=.065+Math.sin(clock.elapsedTime*.8)*.012
  })
  return <mesh ref={ref} visible={false} rotation={[Math.PI/2,0,0]}>
    <ringGeometry args={[.78,.795,96]}/>
    <meshBasicMaterial transparent opacity={.07} depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>
}
