import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function SymptomPulse({pulseKey}:{pulseKey:number}){
  const ref=useRef<THREE.Mesh>(null!)
  const [active,setActive]=useState(false)
  const start=useRef(0)

  useEffect(()=>{
    if(pulseKey<=0)return
    setActive(true)
    start.current=performance.now()/1000
  },[pulseKey])

  useFrame(()=>{
    if(!active)return
    const now=performance.now()/1000
    const u=Math.min(1,(now-start.current)/.72)
    const ease=1-Math.pow(1-u,3)
    const startPos=new THREE.Vector3(4.8,2.5,2.2)
    const mid=new THREE.Vector3(2.0,1.1,1.2)
    const end=new THREE.Vector3(0,0,0)
    const a=startPos.clone().lerp(mid,ease)
    const b=mid.clone().lerp(end,ease)
    ref.current.position.copy(a.lerp(b,ease))
    ref.current.scale.setScalar((1-u)*.75+.08)
    if(u>=1)setActive(false)
  })

  if(!active)return null
  return <mesh ref={ref}>
    <sphereGeometry args={[.09,12,12]}/>
    <meshBasicMaterial color="#d8cdbd" transparent opacity={.9}/>
  </mesh>
}
