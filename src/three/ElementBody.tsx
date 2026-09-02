import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ElementId, ElementVisualState } from '../clinical/types'
import { elementVisualIdentity } from '../content/elementVisualIdentity'
import { ElementFocusHalo } from './ElementFocusHalo'

const canonicalAnchors:Record<ElementId,THREE.Vector3>={
  fire:new THREE.Vector3(0,2.78,.14), earth:new THREE.Vector3(2.62,.82,-.18), metal:new THREE.Vector3(1.64,-2.24,.16),
  water:new THREE.Vector3(-1.64,-2.24,-.12), wood:new THREE.Vector3(-2.62,.82,.22),
}
const driftPhase:Record<ElementId,number>={fire:.2,earth:1.4,metal:2.7,water:4.0,wood:5.2}
export function orbitPosition(id:ElementId,t:number){
  const anchor=canonicalAnchors[id],phase=driftPhase[id]
  return anchor.clone().add(new THREE.Vector3(Math.sin(t*.72+phase)*.025,Math.cos(t*.61+phase)*.018,Math.sin(t*.53+phase)*.03))
}

const gem:Record<ElementId,{color:string,emissive:string,metalness:number,roughness:number}>={
  wood:{color:'#28593b',emissive:'#0d2415',metalness:.08,roughness:.34},
  fire:{color:'#b84227',emissive:'#5e170d',metalness:.04,roughness:.26},
  earth:{color:'#896337',emissive:'#2a1b0d',metalness:.08,roughness:.42},
  metal:{color:'#aeb8c0',emissive:'#20262b',metalness:.76,roughness:.20},
  water:{color:'#1f5674',emissive:'#081b28',metalness:.18,roughness:.25},
}

function Gem({id,onSelect}:{id:ElementId,onSelect:(id:ElementId)=>void}){
  const g=gem[id]
  return <group onClick={(e:any)=>{e.stopPropagation();onSelect(id)}}>
    <mesh castShadow={false} receiveShadow={false}>
      <icosahedronGeometry args={[.79,2]}/>
      <meshStandardMaterial color={g.color} emissive={g.emissive} emissiveIntensity={.42} metalness={g.metalness} roughness={g.roughness}/>
    </mesh>
    <mesh rotation={[1.12,.18,.46]}>
      <torusGeometry args={[.92,.008,4,40]}/>
      <meshBasicMaterial color="#ddb75f" transparent opacity={.18} depthWrite={false}/>
    </mesh>
  </group>
}

export function ElementBody({id,state,onSelect,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!)
  const reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.04)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,4,dt)
    carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,4,dt)
    carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,4,dt)
    const presence=.92+state.activity*.07
    const next=THREE.MathUtils.damp(carrier.current.scale.x,presence,4,dt)
    carrier.current.scale.setScalar(next)
    if(!reducedMotion)carrier.current.rotation.y+=dt*(.025+d.rotation*.03)
  })
  return <group ref={carrier}>
    {focused&&<ElementFocusHalo active/>}
    <Gem id={id} onSelect={onSelect}/>
  </group>
}
