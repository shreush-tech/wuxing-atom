import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ElementVisualState } from '../clinical/types'
import { waterVertex, waterFragment } from './shaders'

function Droplets({activity}:{activity:number}){
  const ref=useRef<THREE.InstancedMesh>(null!)
  const count=12,dummy=useMemo(()=>new THREE.Object3D(),[])
  const specs=useMemo(()=>Array.from({length:count},(_,i)=>({phase:(i*.754)%1,r:.46+(i%4)*.045,y:-.34+(i%5)*.16,s:.018+(i%3)*.008,speed:.08+(i%4)*.012})),[])
  useFrame(({clock})=>{
    if(!ref.current)return
    const t=clock.getElapsedTime();specs.forEach((s,i)=>{
      const q=s.phase*Math.PI*2+t*s.speed
      dummy.position.set(Math.cos(q)*s.r,s.y+Math.sin(q*1.7)*.07,Math.sin(q)*s.r*.56)
      dummy.scale.setScalar(s.s*(.75+activity*.5));dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix)
    });ref.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={ref} args={[undefined,undefined,count]}><sphereGeometry args={[1,8,8]}/><meshPhysicalMaterial color="#9dc6d2" transparent opacity={.32} roughness={.05} metalness={0} transmission={.4} depthWrite={false}/></instancedMesh>
}

export function WaterBody({state,onClick,segments=64}:{state:ElementVisualState,onClick:()=>void,segments?:number}){
  const outer=useRef<THREE.Mesh>(null!),core=useRef<THREE.Mesh>(null!),ring=useRef<THREE.Mesh>(null!)
  const material=useMemo(()=>new THREE.ShaderMaterial({vertexShader:waterVertex,fragmentShader:waterFragment,transparent:true,depthWrite:false,uniforms:{uTime:{value:0},uActivity:{value:0},uCold:{value:0},uHeat:{value:0},uDeep:{value:new THREE.Color('#173f55')},uLight:{value:new THREE.Color('#87b9c8')}}}),[])
  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime();material.uniforms.uTime.value=t
    material.uniforms.uActivity.value=THREE.MathUtils.damp(material.uniforms.uActivity.value,state.activity,4.0,dt)
    material.uniforms.uCold.value=THREE.MathUtils.damp(material.uniforms.uCold.value,state.cold,4.0,dt)
    material.uniforms.uHeat.value=THREE.MathUtils.damp(material.uniforms.uHeat.value,state.heat,4.0,dt)
    outer.current.rotation.y=t*.018;outer.current.rotation.z=Math.sin(t*.28)*.025
    core.current.scale.set(.55+Math.sin(t*.78)*.012,.43+Math.sin(t*.62+.4)*.018,.55+Math.sin(t*.83)*.012)
    ring.current.rotation.z=t*.032;ring.current.rotation.y=Math.sin(t*.11)*.12
  })
  return <group onClick={(e)=>{e.stopPropagation();onClick()}}>
    <mesh ref={outer} material={material}><sphereGeometry args={[.62,segments,segments]}/></mesh>
    <mesh ref={core}><sphereGeometry args={[1,Math.max(24,Math.floor(segments*.55)),Math.max(24,Math.floor(segments*.55))]}/><meshPhysicalMaterial color="#84b6c2" transparent opacity={.10} roughness={.03} metalness={0} transmission={.35} depthWrite={false}/></mesh>
    <Droplets activity={.55+state.activity*.45}/>
    <mesh ref={ring} rotation={[1.25,.12,.28]}><torusGeometry args={[.52,.007,6,96]}/><meshBasicMaterial color="#86c4d4" transparent opacity={.14} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight color="#69b0c7" intensity={.44+state.activity*.25} distance={2.6}/>
  </group>
}
