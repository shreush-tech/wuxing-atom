import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ElementVisualState } from '../clinical/types'
import { fireVertex, fireFragment } from './shaders'

function EmberField({activity}:{activity:number}){
  const ref=useRef<THREE.InstancedMesh>(null!)
  const count=18
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  const specs=useMemo(()=>Array.from({length:count},(_,i)=>({phase:(i*.618)%1,r:.12+(i%5)*.055,s:.018+(i%4)*.006,speed:.18+(i%6)*.022})),[])
  useFrame(({clock},dt)=>{
    if(!ref.current)return
    const t=clock.getElapsedTime()
    specs.forEach((s,i)=>{
      const q=t*s.speed+s.phase*Math.PI*2
      const y=-.46+((t*s.speed*.42+s.phase)%1)*1.0
      const taper=1-Math.abs(y-.08)*.55
      dummy.position.set(Math.cos(q)*s.r*taper,y,Math.sin(q)*s.r*.7*taper)
      dummy.scale.setScalar(s.s*(.7+activity*.7)*(1+.25*Math.sin(t*2.2+i)))
      dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={ref} args={[undefined,undefined,count]} frustumCulled={false}>
    <sphereGeometry args={[1,7,7]}/>
    <meshBasicMaterial color="#ffd3a0" transparent opacity={.68} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/>
  </instancedMesh>
}

export function FireBody({state,onClick}:{state:ElementVisualState,onClick:()=>void}){
  const shell=useRef<THREE.Mesh>(null!)
  const inner=useRef<THREE.Mesh>(null!)
  const core=useRef<THREE.Mesh>(null!)
  const material=useMemo(()=>new THREE.ShaderMaterial({
    vertexShader:fireVertex,fragmentShader:fireFragment,transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uHeat:{value:0},uActivity:{value:0},uExcess:{value:0},uBase:{value:new THREE.Color('#9e4338')},uHot:{value:new THREE.Color('#ffbd86')}}
  }),[])
  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime()
    material.uniforms.uTime.value=t
    material.uniforms.uHeat.value=THREE.MathUtils.damp(material.uniforms.uHeat.value,state.heat,4.2,dt)
    material.uniforms.uActivity.value=THREE.MathUtils.damp(material.uniforms.uActivity.value,state.activity,4.2,dt)
    material.uniforms.uExcess.value=THREE.MathUtils.damp(material.uniforms.uExcess.value,state.excess,4.2,dt)
    shell.current.rotation.y=-t*(.055+.055*state.heat)
    shell.current.rotation.z=Math.sin(t*.23)*.08
    inner.current.rotation.x=-t*.12;inner.current.rotation.z=t*.085
    core.current.scale.set(.46+Math.sin(t*1.7)*.02,.66+Math.sin(t*1.45+.4)*.035,.46+Math.sin(t*1.9)*.018)
  })
  return <group onClick={(e)=>{e.stopPropagation();onClick()}}>
    <mesh ref={shell} material={material} scale={[.88,1.08,.88]}><icosahedronGeometry args={[.63,5]}/></mesh>
    <mesh ref={inner} scale={[.62,.84,.62]}><icosahedronGeometry args={[.50,4]}/><meshBasicMaterial color="#f08a5f" transparent opacity={.11+state.activity*.07} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <mesh ref={core}><sphereGeometry args={[1,24,24]}/><meshBasicMaterial color="#ffe1b5" transparent opacity={.22+state.heat*.16} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/></mesh>
    <EmberField activity={.55+state.activity*.45}/>
    <pointLight color="#ff9c63" intensity={1.2+state.heat*1.4} distance={3.2} decay={2}/>
  </group>
}
