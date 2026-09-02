import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ElementVisualState } from '../clinical/types'

function CrystalCluster(){
  const group=useRef<THREE.Group>(null!)
  const crystals=useMemo(()=>[
    {p:[0,.12,0],s:[.30,.62,.30],r:[.1,.2,.06]},
    {p:[-.28,-.08,.08],s:[.22,.44,.22],r:[-.18,-.2,.38]},
    {p:[.29,-.13,.04],s:[.20,.50,.20],r:[.22,.3,-.42]},
    {p:[.10,-.17,-.28],s:[.16,.38,.16],r:[-.2,.8,.18]},
    {p:[-.12,.02,.29],s:[.14,.32,.14],r:[.4,-.4,.2]},
  ] as {p:number[];s:number[];r:number[]}[],[])
  useFrame(({clock})=>{const t=clock.getElapsedTime();group.current.rotation.y=t*.038;group.current.rotation.x=Math.sin(t*.12)*.08})
  return <group ref={group}>{crystals.map((c,i)=><mesh key={i} position={c.p as [number,number,number]} scale={c.s as [number,number,number]} rotation={c.r as [number,number,number]}>
    <octahedronGeometry args={[1,0]}/><meshPhysicalMaterial color={i===0?'#dce4e9':'#b7c1c8'} roughness={.12+i*.035} metalness={.78} clearcoat={.5} clearcoatRoughness={.08}/>
  </mesh>)}</group>
}

export function MetalBody({state,onClick}:{state:ElementVisualState,onClick:()=>void}){
  const group=useRef<THREE.Group>(null!)
  useFrame(({clock})=>{
    const t=clock.getElapsedTime();group.current.rotation.z=Math.sin(t*.1)*.05;group.current.scale.setScalar(1+Math.sin(t*.65)*(.006+state.deficiency*.005))
  })
  return <group ref={group} onClick={(e)=>{e.stopPropagation();onClick()}}>
    <CrystalCluster/>
    <mesh scale={.66}><icosahedronGeometry args={[.86,2]}/><meshPhysicalMaterial color="#c9d0d4" transparent opacity={.10} roughness={.16} metalness={.86} clearcoat={.8} clearcoatRoughness={.05} depthWrite={false}/></mesh>
    <mesh rotation={[1.2,.2,.32]}><torusGeometry args={[.55,.009,6,96]}/><meshBasicMaterial color="#e9e0c4" transparent opacity={.15} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight color="#dbe7ef" intensity={.36} distance={2.4}/>
  </group>
}
