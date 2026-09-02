import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GOLD = '#d9ad55'
const PALE = '#ffe7a1'
const WARM = '#f4c978'

const canonicalAnchors = [
  new THREE.Vector3(0,2.78,.14),
  new THREE.Vector3(2.62,.82,-.18),
  new THREE.Vector3(1.64,-2.24,.16),
  new THREE.Vector3(-1.64,-2.24,-.12),
  new THREE.Vector3(-2.62,.82,.22),
]

type OrbitSpec={
  a:number;b:number;zWarp:number;rot:[number,number,number];tube:number;opacity:number;speed:number;phase:number
}

class SculpturalOrbitCurve extends THREE.Curve<THREE.Vector3>{
  a:number;b:number;zWarp:number;rotation:THREE.Euler
  constructor(a:number,b:number,zWarp:number,rot:[number,number,number]){
    super(); this.a=a; this.b=b; this.zWarp=zWarp; this.rotation=new THREE.Euler(...rot)
  }
  getPoint(t:number,target=new THREE.Vector3()){
    const q=t*Math.PI*2
    target.set(
      this.a*Math.cos(q),
      this.b*Math.sin(q),
      this.zWarp*Math.sin(q*2)+.08*Math.sin(q*3)
    )
    return target.applyEuler(this.rotation)
  }
}

function makeBridgeCurve(a:THREE.Vector3,b:THREE.Vector3,bulge=.72){
  const mid=a.clone().add(b).multiplyScalar(.5)
  const outward=mid.clone().normalize().multiplyScalar(bulge)
  const control=mid.add(outward).add(new THREE.Vector3(0,0,.28))
  return new THREE.QuadraticBezierCurve3(a,control,b)
}

function StarShell({count,radius,size,opacity,flatten=.82,warm=false}:{count:number,radius:number,size:number,opacity:number,flatten?:number,warm?:boolean}){
  const geometry=useMemo(()=>{
    const positions=new Float32Array(count*3)
    let seed=9173+count
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
    for(let i=0;i<count;i++){
      const theta=rand()*Math.PI*2
      const phi=Math.acos(2*rand()-1)
      const r=radius*(.82+rand()*.34)
      positions[i*3]=Math.sin(phi)*Math.cos(theta)*r
      positions[i*3+1]=Math.cos(phi)*r*flatten
      positions[i*3+2]=Math.sin(phi)*Math.sin(theta)*r
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));return g
  },[count,radius,flatten])
  return <points geometry={geometry}>
    <pointsMaterial color={warm?PALE:'#dce5eb'} size={size} transparent opacity={opacity} sizeAttenuation depthWrite={false}/>
  </points>
}

function CosmicStarfield({reduced=false}:{reduced?:boolean}){
  const ref=useRef<THREE.Group>(null!)
  useFrame(({clock})=>{
    if(reduced||!ref.current)return
    const t=clock.getElapsedTime()
    ref.current.rotation.y=Math.sin(t*.018)*.018
    ref.current.rotation.z=t*.00055
  })
  return <group ref={ref}>
    <StarShell count={90} radius={11} size={.052} opacity={.42} warm/>
    <StarShell count={180} radius={17} size={.034} opacity={.34}/>
    <StarShell count={300} radius={25} size={.022} opacity={.22}/>
  </group>
}

function GoldenOrbitRig({reduced=false}:{reduced?:boolean}){
  const orbitSpecs:OrbitSpec[]=useMemo(()=>[
    {a:3.35,b:2.58,zWarp:.20,rot:[1.12,.10,.02],tube:.010,opacity:.18,speed:.0040,phase:.2},
    {a:3.75,b:3.18,zWarp:.26,rot:[.24,.38,.03],tube:.013,opacity:.24,speed:-.0032,phase:1.1},
    {a:4.06,b:3.35,zWarp:.35,rot:[.82,-.22,.70],tube:.008,opacity:.13,speed:.0024,phase:2.3},
    {a:3.22,b:2.98,zWarp:.42,rot:[.52,.72,-.54],tube:.006,opacity:.11,speed:-.0022,phase:.6},
    {a:2.42,b:1.88,zWarp:.17,rot:[1.28,.18,.42],tube:.006,opacity:.10,speed:.0030,phase:1.7},
    {a:4.28,b:2.66,zWarp:.12,rot:[.06,-.74,.26],tube:.005,opacity:.08,speed:.0016,phase:2.9},
    {a:3.62,b:2.14,zWarp:.31,rot:[1.48,.08,-.44],tube:.006,opacity:.10,speed:-.0018,phase:4.0},
    {a:2.92,b:2.32,zWarp:.20,rot:[.42,-.18,1.10],tube:.005,opacity:.08,speed:.0020,phase:5.0},
  ],[])

  const rings=useMemo(()=>orbitSpecs.map(s=>({
    ...s,
    curve:new SculpturalOrbitCurve(s.a,s.b,s.zWarp,s.rot),
  })),[orbitSpecs])

  const groupRefs=useRef<THREE.Group[]>([])
  const materialRefs=useRef<THREE.MeshBasicMaterial[]>([])
  const geometries=useMemo(()=>rings.map(s=>new THREE.TubeGeometry(s.curve,72,s.tube,4,true)),[rings])
  useFrame(({clock})=>{
    if(reduced)return
    const t=clock.getElapsedTime()
    groupRefs.current.forEach((g,i)=>{
      if(!g)return
      const s=rings[i]
      g.rotation.z=t*s.speed
      g.rotation.y=Math.sin(t*.055+s.phase)*.016
      g.rotation.x=Math.cos(t*.041+s.phase)*.006
      const m=materialRefs.current[i]
      if(m)m.opacity=s.opacity*(.88+.12*(.5+.5*Math.sin(t*.34+s.phase)))
    })
  })

  return <group>
    {rings.map((s,i)=><group key={i} ref={el=>{if(el)groupRefs.current[i]=el}}>
      <mesh geometry={geometries[i]}>
        <meshBasicMaterial ref={el=>{if(el)materialRefs.current[i]=el}} color={GOLD} transparent opacity={s.opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/>
      </mesh>
    </group>)}
    <EnergyParticles curves={rings.map(r=>r.curve)} reduced={reduced}/>
    <EnergyComets curves={rings.map(r=>r.curve)} reduced={reduced}/>
  </group>
}


function EnergyComets({curves,reduced}:{curves:THREE.Curve<THREE.Vector3>[],reduced:boolean}){
  const mesh=useRef<THREE.InstancedMesh>(null!)
  const count=reduced?0:7
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  const tangent=useMemo(()=>new THREE.Vector3(),[])
  const ahead=useMemo(()=>new THREE.Vector3(),[])
  const up=useMemo(()=>new THREE.Vector3(0,1,0),[])
  const assignments=useMemo(()=>Array.from({length:count},(_,i)=>({
    curve:(i*3)%curves.length,
    phase:(i*.38196601125)%1,
    speed:.010+(i%5)*.0018,
    length:.12+(i%4)*.035,
  })),[count,curves.length])

  useFrame(({clock})=>{
    if(reduced||!mesh.current)return
    const time=clock.getElapsedTime()
    assignments.forEach((a,i)=>{
      const u=(a.phase+time*a.speed)%1
      const curve=curves[a.curve]
      dummy.position.copy(curve.getPointAt(u))
      ahead.copy(curve.getPointAt((u+.002)%1))
      tangent.copy(ahead).sub(dummy.position).normalize()
      dummy.quaternion.setFromUnitVectors(up,tangent)
      const pulse=.82+.22*(.5+.5*Math.sin(time*1.7+i*.83))
      dummy.scale.set(.018,a.length*pulse,.018)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i,dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate=true
  })
  if(reduced)return null
  return <instancedMesh ref={mesh} args={[undefined,undefined,count]} frustumCulled={false}>
    <capsuleGeometry args={[1,2,4,8]}/>
    <meshBasicMaterial color={PALE} transparent opacity={.52} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/>
  </instancedMesh>
}

function EnergyParticles({curves,reduced}:{curves:THREE.Curve<THREE.Vector3>[],reduced:boolean}){
  const mesh=useRef<THREE.InstancedMesh>(null!)
  const count=reduced?0:16
  const assignments=useMemo(()=>Array.from({length:count},(_,i)=>({
    curve:i%curves.length,
    phase:(i*.61803398875)%1,
    speed:.018+(i%7)*.0021,
    scale:i%6===0?.050:.026+(i%3)*.005,
  })),[count,curves.length])
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  useFrame(({clock})=>{
    if(!mesh.current||reduced)return
    const time=clock.getElapsedTime()
    assignments.forEach((a,i)=>{
      const t=(a.phase+time*a.speed)%1
      const p=curves[a.curve].getPointAt(t)
      dummy.position.copy(p)
      const pulse=.82+.28*(.5+.5*Math.sin(time*2.15+i*.71))
      dummy.scale.setScalar(a.scale*pulse)
      dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate=true
  })
  if(reduced)return null
  return <instancedMesh ref={mesh} args={[undefined,undefined,count]} frustumCulled={false}>
    <sphereGeometry args={[1,7,7]}/>
    <meshBasicMaterial color={PALE} transparent opacity={.88} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}/>
  </instancedMesh>
}

function StructuralBridges(){
  const bridges=useMemo(()=>canonicalAnchors.map((a,i)=>{
    const b=canonicalAnchors[(i+1)%canonicalAnchors.length]
    return makeBridgeCurve(a,b,.42)
  }),[])
  const geometries=useMemo(()=>bridges.map(curve=>new THREE.TubeGeometry(curve,32,.009,4,false)),[bridges])
  return <group>
    {bridges.map((curve,i)=><mesh key={i} geometry={geometries[i]}>
      <meshBasicMaterial color={WARM} transparent opacity={.13} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>)}
  </group>
}

function StructuralNodes(){
  const nodes=useMemo(()=>[
    ...canonicalAnchors.map(v=>v.clone().multiplyScalar(.52)),
    ...canonicalAnchors.map((v,i)=>v.clone().lerp(canonicalAnchors[(i+1)%5],.5).multiplyScalar(.72))
  ],[])
  return <group>{nodes.map((p,i)=><mesh key={i} position={p}>
    <sphereGeometry args={[i<5?.055:.035,10,10]}/>
    <meshBasicMaterial color={i<5?PALE:GOLD} transparent opacity={i<5?.66:.34} blending={THREE.AdditiveBlending} depthWrite={false}/>
  </mesh>)}</group>
}

/** Decorative vitality sculpture only; no clinical Sheng/Ke semantics are exposed. */
export function CosmicEnergySystem({reduced=false}:{reduced?:boolean}){
  const rig=useRef<THREE.Group>(null!)
  useFrame(({clock})=>{
    if(reduced||!rig.current)return
    const t=clock.getElapsedTime()
    rig.current.rotation.y=Math.sin(t*.042)*.025
    rig.current.rotation.x=Math.cos(t*.031)*.012
  })
  return <>
    <CosmicStarfield reduced={reduced}/>
    <group ref={rig}>
      <GoldenOrbitRig reduced={reduced}/>
      <StructuralBridges/>
      <StructuralNodes/>
    </group>
  </>
}
