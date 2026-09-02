import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useRef,type ReactNode} from 'react'

export function LiveRelationshipChoreography({active,children}:{active:boolean;children:ReactNode}){
 const ref=useRef<THREE.Group>(null!)
 const presence=useRef(active?1:0)
 useFrame((_,dt)=>{
   presence.current=THREE.MathUtils.lerp(presence.current,active?1:0,1-Math.exp(-dt*3))
   if(ref.current){
     ref.current.visible=presence.current>.02
     const s=.97+presence.current*.03
     ref.current.scale.setScalar(s)
   }
 })
 return <group ref={ref}>{children}</group>
}
