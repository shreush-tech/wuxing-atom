import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useMemo,useRef,type ReactNode } from 'react'
import { useClinical } from '../clinical/store'
import { clinicalVisualBridge } from '../content/clinicalVisualBridge'

export function ClinicalRelationshipDynamics({children}:{children:ReactNode}){
  const {clinical}=useClinical()
  const target=useMemo(()=>clinicalVisualBridge(clinical).relationStrength,[clinical])
  const ref=useRef<THREE.Group>(null!)
  const strength=useRef(0)
  useFrame(({clock},dt)=>{
    if(!ref.current)return
    const a=1-Math.exp(-dt*2)
    strength.current=THREE.MathUtils.lerp(strength.current,target,a)
    const s=.94+strength.current*.08+Math.sin(clock.elapsedTime*.75)*.008*strength.current
    ref.current.scale.setScalar(s)
    ref.current.visible=strength.current>.035
  })
  return <group ref={ref}>{children}</group>
}
