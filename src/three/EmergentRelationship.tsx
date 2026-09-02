import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import { useClinical } from '../clinical/store'
import { buildRelationshipEmergence } from '../content/relationshipEmergence'

export function EmergentRelationship({children}:{children:ReactNode}){
  const {clinical}=useClinical()
  const g=useRef<THREE.Group>(null!)
  const e=buildRelationshipEmergence(clinical)

  useFrame(({clock},dt)=>{
    if(!g.current)return
    const target=e.visibility
    const s=THREE.MathUtils.lerp(g.current.scale.x,.82+target*.18,Math.min(1,dt*2.1))
    g.current.scale.setScalar(s)
    g.current.rotation.z=THREE.MathUtils.lerp(
      g.current.rotation.z,
      Math.sin(clock.elapsedTime*(.28+e.flow*.15))*.012*e.tension,
      Math.min(1,dt*1.8)
    )
    g.current.visible=e.stage!=='absent'
  })
  return <group ref={g}>{children}</group>
}
