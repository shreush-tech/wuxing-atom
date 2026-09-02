import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { useClinical } from '../clinical/store'
import { buildDiagnosticVisualization } from '../content/diagnosticVisualization'
import { patternElementMap } from '../content/patternElementMap'

const positions={
  wood:new THREE.Vector3(-2.55,.95,.35),
  fire:new THREE.Vector3(.35,2.25,-.2),
  earth:new THREE.Vector3(2.3,.25,.5),
  metal:new THREE.Vector3(1.05,-2.05,-.25),
  water:new THREE.Vector3(-1.95,-1.65,.15)
}

export function HypothesisField(){
  const {clinical}=useClinical()
  const v=buildDiagnosticVisualization(clinical)
  const refs=useRef<Record<string,THREE.Mesh|null>>({})
  const rings=useMemo(()=>v.hypotheses.slice(0,3).map(h=>({
    ...h, element:patternElementMap[h.id]||'earth'
  })),[v.hypotheses])

  useFrame(({clock},dt)=>{
    rings.forEach((h,i)=>{
      const mesh=refs.current[`${h.id}-${i}`]
      if(!mesh)return
      const base=1.25+h.relative*.38
      const beat=Math.sin(clock.elapsedTime*(.75+h.pulse)+i)*.03*h.pulse
      const target=base+beat
      mesh.scale.lerp(new THREE.Vector3(target,target,target),Math.min(1,dt*3))
      const mat=mesh.material as THREE.MeshBasicMaterial
      mat.opacity=THREE.MathUtils.lerp(mat.opacity,clinical.interview.canShowResult?0:.04+h.relative*.08,Math.min(1,dt*4))
      mesh.rotation.z+=dt*(i%2?-.035:.028)
    })
  })

  if(clinical.interview.canShowResult)return null
  return <group>
    {rings.map((h,i)=>{
      const p=positions[h.element]
      return <mesh key={`${h.id}-${i}`} ref={m=>{refs.current[`${h.id}-${i}`]=m}} position={p}>
        <torusGeometry args={[.78,.008,10,72]}/>
        <meshBasicMaterial transparent opacity={.05} depthWrite={false}/>
      </mesh>
    })}
  </group>
}
