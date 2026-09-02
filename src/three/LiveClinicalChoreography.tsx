import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useEffect,useMemo,useRef,type ReactNode} from 'react'
import type {ClinicalState,ElementId} from '../clinical/types'
import {clinicalAtomDelta} from '../content/clinicalAtomDelta'
import {choreographAtom} from '../content/atomChoreography'

export function LiveClinicalChoreography({clinical,element,children}:{clinical:ClinicalState;element:ElementId;children:ReactNode}){
 const group=useRef<THREE.Group>(null!)
 const previous=useRef<ClinicalState|null>(null)
 const impulse=useRef(0)
 const cue=useRef<'activate'|'deactivate'|'strengthen'|'weaken'|null>(null)

 useEffect(()=>{
   if(previous.current){
     const delta=clinicalAtomDelta(previous.current,clinical)
     const cues=choreographAtom(delta).filter(x=>x.element===element)
     const latest=cues.at(-1)
     if(latest){
       cue.current=latest.kind as typeof cue.current
       impulse.current=latest.intensity
     }
   }
   previous.current=clinical
 },[clinical,element])

 useFrame((_,dt)=>{
   if(!group.current)return
   impulse.current=THREE.MathUtils.lerp(impulse.current,0,1-Math.exp(-dt*2.6))
   const direction=cue.current==='activate'||cue.current==='strengthen'?1:-1
   const scale=1+direction*impulse.current*.055
   group.current.scale.setScalar(scale)
   group.current.rotation.y=direction*impulse.current*.018
 })
 return <group ref={group}>{children}</group>
}
