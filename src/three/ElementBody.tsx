import { MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ElementId, ElementVisualState } from '../clinical/types'
import { WoodBody } from './WoodBody'
import { FireBody } from './FireBody'
import { EarthBody } from './EarthBody'
import { MetalBody } from './MetalBody'
import { WaterBody } from './WaterBody'
import { elementVisualIdentity } from '../content/elementVisualIdentity'
import { ElementFocusHalo } from './ElementFocusHalo'

const canonicalAnchors:Record<ElementId,THREE.Vector3>={
  fire:new THREE.Vector3(0,2.78,.14), earth:new THREE.Vector3(2.62,.82,-.18), metal:new THREE.Vector3(1.64,-2.24,.16),
  water:new THREE.Vector3(-1.64,-2.24,-.12), wood:new THREE.Vector3(-2.62,.82,.22),
}
const driftPhase:Record<ElementId,number>={fire:.2,earth:1.4,metal:2.7,water:4.0,wood:5.2}
export function orbitPosition(id:ElementId,t:number){
  const anchor=canonicalAnchors[id],phase=driftPhase[id]
  return anchor.clone().add(new THREE.Vector3(Math.sin(t*.72+phase)*.065,Math.cos(t*.61+phase)*.045,Math.sin(t*.53+phase)*.09))
}

function GlassVessel({id}:{id:ElementId}){
  const tint:Record<ElementId,string>={wood:'#5f8a6d',fire:'#d87555',earth:'#b38d58',metal:'#c5ced5',water:'#4b829a'}
  return <group>
    <mesh scale={1.34}>
      <sphereGeometry args={[.64,44,44]}/>
      <MeshTransmissionMaterial
        color={tint[id]}
        transmission={1}
        thickness={.72}
        ior={1.22}
        roughness={.08}
        chromaticAberration={.018}
        anisotropicBlur={.05}
        distortion={.08}
        distortionScale={.16}
        temporalDistortion={.03}
        samples={3}
        resolution={64}
        backside
      />
    </mesh>
    <mesh scale={1.355}>
      <sphereGeometry args={[.64,32,32]}/>
      <meshPhysicalMaterial color="#fff6df" transparent opacity={.055} roughness={.10} metalness={0} clearcoat={1} clearcoatRoughness={.04} depthWrite={false}/>
    </mesh>
    <mesh rotation={[1.15,.2,.48]}>
      <torusGeometry args={[.92,.006,6,96]}/>
      <meshBasicMaterial color="#e0b55b" transparent opacity={.14} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>
  </group>
}

function SpecializedBody({id,state,onSelect,waterSegments}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments:number}){
  const click=()=>onSelect(id)
  if(id==='wood')return <WoodBody state={state} onClick={click}/>
  if(id==='fire')return <FireBody state={state} onClick={click}/>
  if(id==='earth')return <EarthBody state={state} onClick={click}/>
  if(id==='metal')return <MetalBody state={state} onClick={click}/>
  return <WaterBody state={state} onClick={click} segments={waterSegments}/>
}

export function ElementBody({id,state,onSelect,waterSegments=64,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!)
  const reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.10)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,3.1,dt)
    carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,3.1,dt)
    carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,3.1,dt)
    const presence=.96+state.activity*.10,breath=reducedMotion?1:1+Math.sin(now*d.breath+driftPhase[id])*.007
    const next=THREE.MathUtils.damp(carrier.current.scale.x,presence*breath,3.4,dt)
    carrier.current.scale.setScalar(next)
    carrier.current.rotation.y=THREE.MathUtils.damp(carrier.current.rotation.y,reducedMotion?0:Math.sin(now*d.rotation+driftPhase[id])*.022,2.6,dt)
  })
  return <group ref={carrier}>
    {focused&&<ElementFocusHalo active/>}
    <GlassVessel id={id}/>
    <SpecializedBody id={id} state={state} onSelect={onSelect} waterSegments={waterSegments}/>
  </group>
}
