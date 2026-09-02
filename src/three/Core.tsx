import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { YinYangCore } from './YinYangCore'

export function Core(){
  const exploreCore=(e:any)=>{e.stopPropagation();if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('wuxing-core-explore'))}
  const outer=useRef<THREE.Mesh>(null!),ring=useRef<THREE.Mesh>(null!)
  const reduced=typeof window!=='undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    if(!outer.current||!ring.current)return
    const t=clock.getElapsedTime()
    const target=reduced?1:1+Math.sin(t*.42)*.004
    outer.current.scale.setScalar(THREE.MathUtils.damp(outer.current.scale.x,target,2.2,dt))
    if(!reduced)ring.current.rotation.z+=dt*.012
  })
  return <group>
    <mesh ref={outer} onClick={exploreCore} onPointerDown={(e:any)=>e.stopPropagation()}>
      <sphereGeometry args={[1.03,28,22]}/>
      <meshPhysicalMaterial color="#d8cfba" transparent opacity={.22} roughness={.12} metalness={.05} clearcoat={.65} clearcoatRoughness={.12} depthWrite={false}/>
    </mesh>
    <YinYangCore reduced={reduced}/>
    <mesh ref={ring} rotation={[.56,.18,.70]}><torusGeometry args={[1.28,.008,5,48]}/><meshBasicMaterial color="#dfb75d" transparent opacity={.18} depthWrite={false}/></mesh>
  </group>
}
