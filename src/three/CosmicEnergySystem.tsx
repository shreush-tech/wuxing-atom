import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GOLD='#d6a43b'
class Orbit extends THREE.Curve<THREE.Vector3>{
  constructor(public a:number,public b:number,public rot:THREE.Euler,public warp=.13){super()}
  getPoint(t:number,target=new THREE.Vector3()){const q=t*Math.PI*2;target.set(this.a*Math.cos(q),this.b*Math.sin(q),this.warp*Math.sin(q*2)+.045*Math.sin(q*3));return target.applyEuler(this.rot)}
}

function makeStars(count:number,minR:number,maxR:number,seed0:number){
  const p=new Float32Array(count*3);let seed=seed0
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
  for(let i=0;i<count;i++){const th=rand()*Math.PI*2,ph=Math.acos(2*rand()-1),r=minR+rand()*(maxR-minR);p[i*3]=Math.sin(ph)*Math.cos(th)*r;p[i*3+1]=Math.cos(ph)*r*.72;p[i*3+2]=Math.sin(ph)*Math.sin(th)*r}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return g
}

export function CosmicEnergySystem(){
  const field=useRef<THREE.Group>(null!),movers=useRef<THREE.InstancedMesh>(null!),cores=useRef<THREE.InstancedMesh>(null!),streaks=useRef<THREE.InstancedMesh>(null!)
  const starMatA=useRef<any>(null!),starMatB=useRef<any>(null!)
  const dummy=useMemo(()=>new THREE.Object3D(),[]),next=useMemo(()=>new THREE.Vector3(),[]),dir=useMemo(()=>new THREE.Vector3(),[])
  const curves=useMemo(()=>[
    new Orbit(3.45,2.65,new THREE.Euler(1.03,.08,.02),.12),
    new Orbit(3.78,3.08,new THREE.Euler(.22,.36,.02),.10),
    new Orbit(3.86,2.96,new THREE.Euler(.72,-.18,.64),.14),
    new Orbit(3.02,2.42,new THREE.Euler(.44,.56,-.46),.11),
    new Orbit(3.34,2.58,new THREE.Euler(.92,-.42,-.34),.13)
  ],[])
  const auraGeo=useMemo(()=>curves.map(c=>new THREE.TubeGeometry(c,78,.068,6,true)),[curves])
  const bodyGeo=useMemo(()=>curves.map(c=>new THREE.TubeGeometry(c,78,.030,5,true)),[curves])
  const coreGeo=useMemo(()=>curves.map(c=>new THREE.TubeGeometry(c,78,.008,4,true)),[curves])
  const starsA=useMemo(()=>makeStars(150,7.0,13.8,421),[]),starsB=useMemo(()=>makeStars(56,6.6,11.8,1771),[])

  useFrame(({clock})=>{
    const t=clock.elapsedTime
    if(field.current){field.current.rotation.y=Math.sin(t*.07)*.012;field.current.rotation.x=Math.cos(t*.055)*.006}
    if(starMatA.current)starMatA.current.opacity=.30+.08*Math.sin(t*.33)
    if(starMatB.current)starMatB.current.opacity=.42+.10*Math.sin(t*.41+1.3)
    for(let i=0;i<16;i++){
      const c=curves[i%curves.length],speed=.028+(i%4)*.004,u=(t*speed+i*.079)%1,p=c.getPoint(u)
      dummy.position.copy(p);dummy.scale.setScalar(i%5===0?.105:.064);dummy.rotation.set(0,0,0);dummy.updateMatrix();movers.current?.setMatrixAt(i,dummy.matrix)
      dummy.scale.setScalar(i%5===0?.043:.026);dummy.updateMatrix();cores.current?.setMatrixAt(i,dummy.matrix)
      const q=c.getPoint((u+.008)%1,next);dir.copy(q).sub(p).normalize();dummy.position.copy(p);dummy.scale.set(.035,.035,i%5===0?.38:.25);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir);dummy.updateMatrix();streaks.current?.setMatrixAt(i,dummy.matrix)
    }
    if(movers.current)movers.current.instanceMatrix.needsUpdate=true
    if(cores.current)cores.current.instanceMatrix.needsUpdate=true
    if(streaks.current)streaks.current.instanceMatrix.needsUpdate=true
  })

  return <group ref={field}>
    <points geometry={starsA}><pointsMaterial ref={starMatA} color="#d9cfb5" size={.035} transparent opacity={.32} depthWrite={false}/></points>
    <points geometry={starsB}><pointsMaterial ref={starMatB} color="#fff0ba" size={.062} transparent opacity={.45} depthWrite={false}/></points>
    {curves.map((_,i)=><group key={i}>
      <mesh geometry={auraGeo[i]}><meshBasicMaterial color={GOLD} transparent opacity={.075} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      <mesh geometry={bodyGeo[i]}><meshBasicMaterial color="#d8ad50" transparent opacity={.24} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      <mesh geometry={coreGeo[i]}><meshBasicMaterial color="#fff4c7" transparent opacity={.38} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    </group>)}
    <instancedMesh ref={streaks} args={[undefined,undefined,16]}><sphereGeometry args={[1,7,5]}/><meshBasicMaterial color="#ffd86f" transparent opacity={.36} depthWrite={false} blending={THREE.AdditiveBlending}/></instancedMesh>
    <instancedMesh ref={movers} args={[undefined,undefined,16]}><sphereGeometry args={[1,8,6]}/><meshBasicMaterial color="#efbd52" transparent opacity={.38} depthWrite={false} blending={THREE.AdditiveBlending}/></instancedMesh>
    <instancedMesh ref={cores} args={[undefined,undefined,16]}><sphereGeometry args={[1,7,5]}/><meshBasicMaterial color="#fffaf0" transparent opacity={.82} depthWrite={false} blending={THREE.AdditiveBlending}/></instancedMesh>
  </group>
}
