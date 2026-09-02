import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useEffect,useRef } from 'react'
import { useClinical } from '../clinical/store'

export function RevealConductor(){
  const {clinical}=useClinical()
  const group=useRef<THREE.Group>(null!)
  const readyAt=useRef<number|null>(null)

  useEffect(()=>{
    if(clinical.interview.canShowResult && readyAt.current===null)readyAt.current=performance.now()
    if(!clinical.interview.canShowResult)readyAt.current=null
  },[clinical.interview.canShowResult])

  useFrame(({clock},dt)=>{
    if(!group.current)return
    if(readyAt.current===null){group.current.scale.setScalar(1);return}
    const elapsed=performance.now()-readyAt.current
    // restrained "breath in" followed by settling; no clinical meaning.
    const target=elapsed<650?.97:elapsed<1700?1.02:1
    const s=THREE.MathUtils.lerp(group.current.scale.x,target,Math.min(1,dt*1.8))
    group.current.scale.setScalar(s)
    group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,elapsed<2400?.035:0,Math.min(1,dt*.9))
  })
  return <group ref={group}/>
}
