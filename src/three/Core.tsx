import { MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { YinYangCore } from './YinYangCore'

export function Core(){
  const exploreCore=(e:any)=>{
    e.stopPropagation()
    if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('wuxing-core-explore'))
  }
  const outer=useRef<THREE.Mesh>(null!),ringA=useRef<THREE.Mesh>(null!),ringB=useRef<THREE.Mesh>(null!)
  const reduced=typeof window!=='undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime()
    if(!outer.current||!ringA.current||!ringB.current)return
    const targetScale=reduced?1:1+Math.sin(t*.48)*.008
    const s=THREE.MathUtils.damp(outer.current.scale.x,targetScale,2.4,dt)
    outer.current.scale.setScalar(s)
    if(!reduced){
      ringA.current.rotation.z+=dt*.018
      ringA.current.rotation.x=THREE.MathUtils.damp(ringA.current.rotation.x,1.18+Math.sin(t*.09)*.05,1.8,dt)
      ringB.current.rotation.y-=dt*.014
      ringB.current.rotation.z=THREE.MathUtils.damp(ringB.current.rotation.z,.62+Math.sin(t*.07)*.04,1.6,dt)
    }
  })
  return <group>
    <mesh ref={outer}
      onClick={exploreCore}
      onPointerOver={(e:any)=>e.stopPropagation()}
      onPointerDown={(e:any)=>e.stopPropagation()}
    >
      <sphereGeometry args={[1.02,56,56]}/>
      <MeshTransmissionMaterial color="#e9e0c7" transmission={1} thickness={1.28} ior={1.18} roughness={.10} chromaticAberration={.012} anisotropicBlur={.035} distortion={.04} distortionScale={.08} samples={3} resolution={96} backside/>
    </mesh>
    <YinYangCore reduced={reduced}/>
    <mesh ref={ringA}><torusGeometry args={[1.22,.011,7,128]}/><meshBasicMaterial color="#d7ab55" transparent opacity={.16} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <mesh ref={ringB} rotation={[.55,.22,.72]}><torusGeometry args={[1.34,.006,6,128]}/><meshBasicMaterial color="#f3d382" transparent opacity={.085} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight color="#e8ca84" intensity={2.25} distance={6} decay={2}/>
  </group>
}
