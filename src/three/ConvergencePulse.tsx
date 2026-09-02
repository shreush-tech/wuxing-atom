import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useClinical } from '../clinical/store'

export function ConvergencePulse(){
  const {clinical}=useClinical()
  const ring=useRef<THREE.Mesh>(null!)
  useFrame(({clock},dt)=>{
    if(!ring.current)return
    const active=clinical.interview.canShowResult
    const target=active?1.8:.25
    const s=THREE.MathUtils.lerp(ring.current.scale.x,target,Math.min(1,dt*(active?1.3:2.8)))
    ring.current.scale.setScalar(s)
    const mat=ring.current.material as THREE.MeshBasicMaterial
    const pulse=active?.08+Math.sin(clock.elapsedTime*.9)*.018:.015
    mat.opacity=THREE.MathUtils.lerp(mat.opacity,pulse,Math.min(1,dt*2))
  })
  return <mesh ref={ring} rotation={[Math.PI/2,0,0]}>
    <torusGeometry args={[1.05,.012,12,96]}/>
    <meshBasicMaterial transparent opacity={.02} depthWrite={false}/>
  </mesh>
}
