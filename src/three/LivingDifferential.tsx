import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { type ReactNode, useRef } from 'react'
import { useClinical } from '../clinical/store'
import { buildElementDynamics, type ElementKey } from '../content/elementDynamics'

export function LivingDifferential({element,children}:{element:ElementKey;children:ReactNode}){
  const {clinical}=useClinical()
  const group=useRef<THREE.Group>(null!)
  const dynamics=buildElementDynamics(clinical)[element]

  useFrame(({clock},dt)=>{
    const g=group.current
    if(!g)return
    const t=clock.elapsedTime
    const breath=Math.sin(t*(.42+dynamics.orbitBreath))*.018*dynamics.orbitBreath
    const tension=dynamics.isCompeting?Math.sin(t*1.1)*.008:0
    const targetScale=.965+(dynamics.presence-.48)*.10+breath
    const s=THREE.MathUtils.lerp(g.scale.x,targetScale,Math.min(1,dt*2.2))
    g.scale.setScalar(s)
    g.rotation.z=THREE.MathUtils.lerp(g.rotation.z,tension,Math.min(1,dt*2.4))
  })

  return <group ref={group}>{children}</group>
}
