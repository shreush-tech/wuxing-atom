import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function CoreAura(){
  const mesh=useRef<THREE.Mesh>(null!)
  useFrame(({clock})=>{
    if(!mesh.current)return
    const s=1.22+Math.sin(clock.elapsedTime*.55)*.025
    mesh.current.scale.setScalar(s)
    mesh.current.rotation.y=clock.elapsedTime*.035
  })
  return <mesh ref={mesh}>
    <icosahedronGeometry args={[.86,3]}/>
    <meshPhysicalMaterial transparent opacity={.035} roughness={.18} metalness={0} transmission={.35} depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>
}
