import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useMemo,useRef,type ReactNode } from 'react'
import { useClinical } from '../clinical/store'
import { clinicalVisualBridge,type ElementKey } from '../content/clinicalVisualBridge'

export function ClinicalVisualDynamics({element,children}:{element:ElementKey,children:ReactNode}){
  const {clinical}=useClinical()
  const target=useMemo(()=>clinicalVisualBridge(clinical).elements[element],[clinical,element])
  const group=useRef<THREE.Group>(null!)
  const current=useRef({presence:.82,breath:1,orbit:1,luminosity:.58,tension:0})

  useFrame(({clock},dt)=>{
    if(!group.current)return
    const a=1-Math.exp(-dt*2.2)
    for(const k of Object.keys(current.current) as (keyof typeof current.current)[]){
      current.current[k]=THREE.MathUtils.lerp(current.current[k],target[k],a)
    }
    const pulse=1+Math.sin(clock.elapsedTime*.72+element.length)*.007*current.current.breath
    const scale=current.current.presence*pulse
    group.current.scale.setScalar(scale)
    group.current.rotation.z=Math.sin(clock.elapsedTime*.33+element.length)*.012*current.current.tension
  })
  return <group ref={group}>{children}</group>
}
