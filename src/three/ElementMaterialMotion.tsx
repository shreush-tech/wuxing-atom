import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef,type ReactNode } from 'react'
import { elementVisualIdentity } from '../content/elementVisualIdentity'

type Key=keyof typeof elementVisualIdentity

export function ElementMaterialMotion({element,children}:{element:Key,children:ReactNode}){
  const ref=useRef<THREE.Group>(null!)
  const v=elementVisualIdentity[element]
  useFrame(({clock},dt)=>{
    if(!ref.current)return
    const t=clock.elapsedTime
    const breath=1+Math.sin(t*v.breath+element.length)*.008
    const targetY=Math.sin(t*v.rotation)*.035
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x,breath,Math.min(1,dt*2)))
    ref.current.rotation.y=THREE.MathUtils.lerp(ref.current.rotation.y,targetY,Math.min(1,dt*1.1))
    ref.current.rotation.x=Math.sin(t*v.rotation*.7+1.4)*.012
  })
  return <group ref={ref}>{children}</group>
}
