import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo,useRef } from 'react'
import { atomArtDirection } from '../content/atomArtDirection'

export function AtmosphereDust(){
  const ref=useRef<THREE.Points>(null!)
  const mobile=typeof window!=='undefined' && window.innerWidth<760
  const count=mobile?atomArtDirection.atmosphere.dustCountMobile:atomArtDirection.atmosphere.dustCountDesktop
  const positions=useMemo(()=>{
    const a=new Float32Array(count*3)
    for(let i=0;i<count;i++){
      const r=2.4+Math.random()*atomArtDirection.atmosphere.dustRadius
      const theta=Math.random()*Math.PI*2
      const phi=Math.acos(2*Math.random()-1)
      a[i*3]=r*Math.sin(phi)*Math.cos(theta)
      a[i*3+1]=r*Math.cos(phi)*.72
      a[i*3+2]=r*Math.sin(phi)*Math.sin(theta)
    }
    return a
  },[count])
  useFrame((_,dt)=>{
    if(ref.current)ref.current.rotation.y+=dt*.006
  })
  return <Points ref={ref} positions={positions} stride={3} frustumCulled>
    <PointMaterial transparent size={.018} sizeAttenuation depthWrite={false} opacity={.16}/>
  </Points>
}
