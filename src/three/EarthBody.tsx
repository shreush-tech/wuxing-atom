import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ElementVisualState } from '../clinical/types'

function Moss({deficiency}:{deficiency:number}){
  const mesh=useRef<THREE.InstancedMesh>(null!)
  const patches=useMemo(()=>[
    [-.28,.36,.34,.12],[.21,.43,.27,.09],[.34,.12,.38,.08],[-.38,.05,.31,.07],[.08,.57,.08,.08],[-.12,.45,-.30,.07]
  ] as [number,number,number,number][],[])
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  useFrame(({clock})=>{
    if(!mesh.current)return
    const t=clock.getElapsedTime()
    patches.forEach((p,i)=>{
      dummy.position.set(p[0],p[1],p[2])
      dummy.rotation.set(i*.3,t*.015+i*.4,i*.21)
      const s=p[3]*(1-deficiency*.18)*(1+.06*Math.sin(t*.45+i))
      dummy.scale.set(s*1.3,s*.42,s)
      dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={mesh} args={[undefined,undefined,patches.length]}>
    <sphereGeometry args={[1,10,7]}/><meshStandardMaterial color="#688264" roughness={.88}/>
  </instancedMesh>
}

export function EarthBody({state,onClick}:{state:ElementVisualState,onClick:()=>void}){
  const ref=useRef<THREE.Group>(null!)
  const stones=useRef<THREE.Group>(null!)
  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime(),instability=state.deficiency*.026
    ref.current.rotation.x=Math.sin(t*.28)*instability;ref.current.rotation.z=Math.cos(t*.24)*instability;ref.current.rotation.y+=dt*.020
    const compression=1-state.cold*.018;ref.current.scale.x=THREE.MathUtils.damp(ref.current.scale.x,1.01,2.2,dt);ref.current.scale.y=THREE.MathUtils.damp(ref.current.scale.y,compression,2.2,dt);ref.current.scale.z=THREE.MathUtils.damp(ref.current.scale.z,.99,2.2,dt)
    stones.current.rotation.y+=dt*.010
  })
  return <group ref={ref} onClick={(e)=>{e.stopPropagation();onClick()}}>
    <group ref={stones}>
      <mesh scale={[.84,.78,.80]}><dodecahedronGeometry args={[.64,2]}/><meshStandardMaterial color="#9e794f" roughness={.96}/></mesh>
      <mesh position={[.28,.14,.16]} scale={.40}><icosahedronGeometry args={[.55,1]}/><meshStandardMaterial color="#c29b67" roughness={.90}/></mesh>
      <mesh position={[-.31,-.15,.18]} scale={.32}><dodecahedronGeometry args={[.55,1]}/><meshStandardMaterial color="#7f6044" roughness={1}/></mesh>
      <mesh position={[.05,-.25,-.28]} scale={.30}><icosahedronGeometry args={[.55,1]}/><meshStandardMaterial color="#b68b57" roughness={.94}/></mesh>
    </group>
    <Moss deficiency={state.deficiency}/>
    <mesh rotation={[1.48,0,.2]} position={[0,-.47,0]}><torusGeometry args={[.43,.012,6,96]}/><meshBasicMaterial color="#bba26d" transparent opacity={.10} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    <pointLight position={[0,.3,.2]} color="#d5b079" intensity={.28} distance={2}/>
  </group>
}
