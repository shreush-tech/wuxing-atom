import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GOLD='#dca93b'
class Orbit extends THREE.Curve<THREE.Vector3>{
  constructor(public a:number,public b:number,public rot:THREE.Euler){super()}
  getPoint(t:number,target=new THREE.Vector3()){const q=t*Math.PI*2;target.set(this.a*Math.cos(q),this.b*Math.sin(q),.16*Math.sin(q*2));return target.applyEuler(this.rot)}
}
export function CosmicEnergySystem(){
  const glow=useRef<THREE.Group>(null!),movers=useRef<THREE.InstancedMesh>(null!),cores=useRef<THREE.InstancedMesh>(null!)
  const dummy=useMemo(()=>new THREE.Object3D(),[])
  const curves=useMemo(()=>[new Orbit(3.5,2.7,new THREE.Euler(1.05,.08,.02)),new Orbit(3.8,3.15,new THREE.Euler(.22,.36,.02)),new Orbit(3.9,3.0,new THREE.Euler(.72,-.18,.64)),new Orbit(3.0,2.42,new THREE.Euler(.44,.56,-.46))],[])
  const goldGeo=useMemo(()=>curves.map((c,i)=>new THREE.TubeGeometry(c,64,i===1?.052:.043,6,true)),[curves])
  const coreGeo=useMemo(()=>curves.map(c=>new THREE.TubeGeometry(c,64,.010,5,true)),[curves])
  const stars=useMemo(()=>{const n=82,p=new Float32Array(n*3);let seed=421;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<n;i++){const th=rand()*Math.PI*2,ph=Math.acos(2*rand()-1),r=7.5+rand()*6.5;p[i*3]=Math.sin(ph)*Math.cos(th)*r;p[i*3+1]=Math.cos(ph)*r*.72;p[i*3+2]=Math.sin(ph)*Math.sin(th)*r}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return g},[])
  useFrame(({clock})=>{
    const t=clock.elapsedTime;if(glow.current)glow.current.rotation.y=Math.sin(t*.10)*.018
    for(let i=0;i<14;i++){const c=curves[i%curves.length],u=(t*(.040+(i%4)*.006)+i*.071)%1,p=c.getPoint(u);dummy.position.copy(p);dummy.scale.setScalar(i%5===0?.115:.078);dummy.updateMatrix();movers.current?.setMatrixAt(i,dummy.matrix);dummy.scale.setScalar(i%5===0?.055:.035);dummy.updateMatrix();cores.current?.setMatrixAt(i,dummy.matrix)}
    if(movers.current)movers.current.instanceMatrix.needsUpdate=true;if(cores.current)cores.current.instanceMatrix.needsUpdate=true
  })
  return <group ref={glow}>
    <points geometry={stars}><pointsMaterial color="#e9d7a8" size={.052} transparent opacity={.28} depthWrite={false}/></points>
    {goldGeo.map((g,i)=><group key={i}>
      <mesh geometry={g}><meshBasicMaterial color={GOLD} transparent opacity={i===1?.44:.36} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      <mesh geometry={coreGeo[i]}><meshBasicMaterial color="#fff7cf" transparent opacity={i===1?.56:.42} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    </group>)}
    <instancedMesh ref={movers} args={[undefined,undefined,14]}><sphereGeometry args={[1,8,6]}/><meshBasicMaterial color="#ffd964" transparent opacity={.74} depthWrite={false} blending={THREE.AdditiveBlending}/></instancedMesh>
    <instancedMesh ref={cores} args={[undefined,undefined,14]}><sphereGeometry args={[1,7,5]}/><meshBasicMaterial color="#ffffff" transparent opacity={.95} depthWrite={false} blending={THREE.AdditiveBlending}/></instancedMesh>
  </group>
}
