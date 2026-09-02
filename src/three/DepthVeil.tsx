import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function DepthVeil(){
  const a=useRef<THREE.Mesh>(null!), b=useRef<THREE.Mesh>(null!)
  useFrame(({pointer},dt)=>{
    if(a.current){
      a.current.position.x=THREE.MathUtils.lerp(a.current.position.x,pointer.x*.12,dt*.6)
      a.current.position.y=THREE.MathUtils.lerp(a.current.position.y,pointer.y*.08,dt*.6)
    }
    if(b.current){
      b.current.position.x=THREE.MathUtils.lerp(b.current.position.x,-pointer.x*.08,dt*.5)
      b.current.position.y=THREE.MathUtils.lerp(b.current.position.y,-pointer.y*.06,dt*.5)
    }
  })
  return <group>
    <mesh ref={a} position={[-2.8,1.8,-3.8]} rotation={[.2,.35,.1]}>
      <circleGeometry args={[1.7,64]}/>
      <meshBasicMaterial transparent opacity={.012} depthWrite={false} side={THREE.DoubleSide}/>
    </mesh>
    <mesh ref={b} position={[3,-1.6,-4.5]} rotation={[-.1,-.4,.2]}>
      <circleGeometry args={[2.1,64]}/>
      <meshBasicMaterial transparent opacity={.009} depthWrite={false} side={THREE.DoubleSide}/>
    </mesh>
  </group>
}
