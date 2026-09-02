import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import type { ElementId, ElementVisualState } from '../clinical/types'
import { elementVisualIdentity } from '../content/elementVisualIdentity'

const canonicalAnchors:Record<ElementId,THREE.Vector3>={
  fire:new THREE.Vector3(0,2.78,.14), earth:new THREE.Vector3(2.62,.82,-.18), metal:new THREE.Vector3(1.64,-2.24,.16),
  water:new THREE.Vector3(-1.64,-2.24,-.12), wood:new THREE.Vector3(-2.62,.82,.22),
}
const driftPhase:Record<ElementId,number>={fire:.2,earth:1.4,metal:2.7,water:4.0,wood:5.2}
export function orbitPosition(id:ElementId,t:number){
  const anchor=canonicalAnchors[id],phase=driftPhase[id]
  return anchor.clone().add(new THREE.Vector3(Math.sin(t*.72+phase)*.018,Math.cos(t*.61+phase)*.012,Math.sin(t*.53+phase)*.018))
}

const gem:Record<ElementId,{color:string,emissive:string,metalness:number,roughness:number}>= {
  wood:{color:'#315d43',emissive:'#102619',metalness:.10,roughness:.30},
  fire:{color:'#b74428',emissive:'#64180c',metalness:.06,roughness:.22},
  earth:{color:'#8d683d',emissive:'#30200e',metalness:.12,roughness:.34},
  metal:{color:'#aab3b9',emissive:'#242b30',metalness:.82,roughness:.17},
  water:{color:'#235d7a',emissive:'#092131',metalness:.20,roughness:.20},
}

function Gem({id,onSelect}:{id:ElementId,onSelect:(id:ElementId)=>void}){
  const g=gem[id], [hovered,setHovered]=useState(false), halo=useRef<THREE.Mesh>(null!), stone=useRef<THREE.Mesh>(null!)
  useFrame(({clock},dt)=>{
    if(halo.current){
      const target=hovered?1.12:1
      halo.current.scale.setScalar(THREE.MathUtils.damp(halo.current.scale.x,target,10,dt))
      ;(halo.current.material as THREE.MeshBasicMaterial).opacity=THREE.MathUtils.damp((halo.current.material as THREE.MeshBasicMaterial).opacity,hovered?.72:.14,10,dt)
    }
    if(stone.current){
      const target=hovered?1.045:1
      stone.current.scale.setScalar(THREE.MathUtils.damp(stone.current.scale.x,target,10,dt))
      if(hovered) stone.current.rotation.z=Math.sin(clock.elapsedTime*1.5)*.018
    }
  })
  return <group
    onPointerOver={(e:any)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}}
    onPointerOut={()=>{setHovered(false);document.body.style.cursor=''}}
    onClick={(e:any)=>{e.stopPropagation();onSelect(id)}}
  >
    <mesh ref={halo} scale={1}>
      <icosahedronGeometry args={[.88,1]}/>
      <meshBasicMaterial color="#f2c96b" transparent opacity={.14} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
    <mesh ref={stone} castShadow={false} receiveShadow={false}>
      <icosahedronGeometry args={[.79,2]}/>
      <meshStandardMaterial color={g.color} emissive={g.emissive} emissiveIntensity={.48} metalness={g.metalness} roughness={g.roughness}/>
    </mesh>
    <mesh rotation={[1.12,.18,.46]}>
      <torusGeometry args={[.94,.014,5,48]}/>
      <meshBasicMaterial color="#e9bd5e" transparent opacity={hovered?.58:.24} depthWrite={false}/>
    </mesh>
    <pointLight color="#efc46b" intensity={hovered?.48:.05} distance={2.3} decay={2}/>
  </group>
}

export function ElementBody({id,state,onSelect,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!)
  const reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.032)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,4,dt)
    carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,4,dt)
    carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,4,dt)
    const presence=.92+state.activity*.07+(focused?.035:0)
    const next=THREE.MathUtils.damp(carrier.current.scale.x,presence,5,dt)
    carrier.current.scale.setScalar(next)
    if(!reducedMotion)carrier.current.rotation.y+=dt*(.018+d.rotation*.018)
  })
  return <group ref={carrier}><Gem id={id} onSelect={onSelect}/></group>
}
