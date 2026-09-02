import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ElementVisualState } from '../clinical/types'
import { woodVertex, woodFragment } from './shaders'

function Branch({a,b,r,material}:{a:THREE.Vector3,b:THREE.Vector3,r:number,material:THREE.ShaderMaterial}){
  const dir=b.clone().sub(a)
  const len=dir.length()
  const mid=a.clone().add(b).multiplyScalar(.5)
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize())
  return <mesh position={mid} quaternion={q} material={material}>
    <capsuleGeometry args={[r,Math.max(.01,len-r*2),8,14]}/>
  </mesh>
}

function LeafCloud({activity}:{activity:number}){
  const mesh=useRef<THREE.InstancedMesh>(null!)
  const leaves=useMemo(()=>{
    let seed=4219
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
    return Array.from({length:34},(_,i)=>{
      const y=-.02+rand()*.88
      const side=(i%2?1:-1)*( .16+rand()*.46 )
      const z=(rand()-.5)*.42
      const s=.045+rand()*.052
      return {p:new THREE.Vector3(side,y,z),r:new THREE.Euler(rand()*1.8,rand()*Math.PI,rand()*Math.PI),s}
    })
  },[])
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  useFrame(({clock})=>{
    if(!mesh.current)return
    const t=clock.getElapsedTime()
    leaves.forEach((l,i)=>{
      dummy.position.copy(l.p)
      dummy.position.x+=Math.sin(t*.42+i*.77)*(.006+.008*activity)
      dummy.rotation.set(l.r.x,l.r.y+t*.035,l.r.z)
      const pulse=1+Math.sin(t*.72+i*.61)*.06
      dummy.scale.set(l.s*.55*1.65*activity+l.s*.45,l.s*pulse,l.s*.38)
      dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate=true
  })
  return <instancedMesh ref={mesh} args={[undefined,undefined,leaves.length]} frustumCulled={false}>
    <sphereGeometry args={[1,8,6]}/>
    <meshPhysicalMaterial color="#6f9a6f" roughness={.58} metalness={0} clearcoat={.12} clearcoatRoughness={.42}/>
  </instancedMesh>
}

function RootHalo(){
  const ref=useRef<THREE.Group>(null!)
  useFrame(({clock})=>{const t=clock.getElapsedTime();ref.current.rotation.y=t*.018;ref.current.rotation.z=Math.sin(t*.09)*.08})
  return <group ref={ref} position={[0,-.44,0]}>
    {[0,.3,-.3].map((z,i)=><mesh key={i} rotation={[1.36+i*.08,.1+i*.3,.35+i*.5]}>
      <torusGeometry args={[.45+i*.06,.006,5,88]}/>
      <meshBasicMaterial color="#9fbf84" transparent opacity={.08-i*.012} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>)}
  </group>
}

export function WoodBody({state,onClick}:{state:ElementVisualState,onClick:()=>void}){
  const group=useRef<THREE.Group>(null!)
  const material=useMemo(()=>new THREE.ShaderMaterial({
    vertexShader:woodVertex,
    fragmentShader:woodFragment,
    uniforms:{
      uTime:{value:0},uStagnation:{value:0},uActivity:{value:0},
      uDark:{value:new THREE.Color('#24432f')},uLight:{value:new THREE.Color('#789b79')}
    }
  }),[])

  const tree=useMemo(()=>[
    [new THREE.Vector3(0,-.72,0),new THREE.Vector3(.02,-.08,.02),.17],
    [new THREE.Vector3(.02,-.08,.02),new THREE.Vector3(-.13,.45,.06),.145],
    [new THREE.Vector3(-.13,.45,.06),new THREE.Vector3(.02,.83,.03),.105],
    [new THREE.Vector3(-.06,.18,.04),new THREE.Vector3(-.50,.46,.13),.085],
    [new THREE.Vector3(-.50,.46,.13),new THREE.Vector3(-.68,.72,.21),.055],
    [new THREE.Vector3(-.10,.41,.02),new THREE.Vector3(.34,.61,-.12),.078],
    [new THREE.Vector3(.34,.61,-.12),new THREE.Vector3(.58,.84,-.18),.05],
    [new THREE.Vector3(.00,-.12,.02),new THREE.Vector3(.38,.10,.18),.075],
    [new THREE.Vector3(.38,.10,.18),new THREE.Vector3(.59,.31,.28),.048],
    [new THREE.Vector3(-.02,.58,.02),new THREE.Vector3(-.34,.78,-.18),.06],
    [new THREE.Vector3(-.12,.05,.0),new THREE.Vector3(-.42,-.20,-.12),.055],
    [new THREE.Vector3(.05,-.02,.02),new THREE.Vector3(.42,-.22,.10),.052],
  ] as [THREE.Vector3,THREE.Vector3,number][],[])

  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime()
    material.uniforms.uTime.value=t
    material.uniforms.uStagnation.value=THREE.MathUtils.damp(material.uniforms.uStagnation.value,state.stagnation,4.0,dt)
    material.uniforms.uActivity.value=THREE.MathUtils.damp(material.uniforms.uActivity.value,state.activity,4.0,dt)
    group.current.rotation.y+=dt*(.025+.029*state.activity)
    group.current.rotation.z=Math.sin(t*.31)*(.016+.034*state.stagnation)
  })

  return <group ref={group} onClick={(e)=>{e.stopPropagation();onClick()}}>
    {tree.map(([a,b,r],i)=><Branch key={i} a={a} b={b} r={r} material={material}/>)}
    <LeafCloud activity={.55+state.activity*.45}/>
    <RootHalo/>
    <pointLight position={[0,.22,.05]} color="#729b67" intensity={.38+state.activity*.48} distance={2.2}/>
  </group>
}
