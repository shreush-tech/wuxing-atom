import { useMemo } from 'react'
import * as THREE from 'three'

const GOLD='#d9ad55'
class Orbit extends THREE.Curve<THREE.Vector3>{
  constructor(public a:number,public b:number,public rot:THREE.Euler){super()}
  getPoint(t:number,target=new THREE.Vector3()){const q=t*Math.PI*2;target.set(this.a*Math.cos(q),this.b*Math.sin(q),.16*Math.sin(q*2));return target.applyEuler(this.rot)}
}
export function CosmicEnergySystem(){
  const curves=useMemo(()=>[
    new Orbit(3.5,2.7,new THREE.Euler(1.05,.08,.02)),
    new Orbit(3.8,3.15,new THREE.Euler(.22,.36,.02)),
    new Orbit(3.9,3.0,new THREE.Euler(.72,-.18,.64)),
    new Orbit(3.0,2.42,new THREE.Euler(.44,.56,-.46)),
  ],[])
  const geometries=useMemo(()=>curves.map((c,i)=>new THREE.TubeGeometry(c,40,i===1?.012:.007,3,true)),[curves])
  const stars=useMemo(()=>{
    const n=72,p=new Float32Array(n*3);let seed=421
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
    for(let i=0;i<n;i++){const th=rand()*Math.PI*2,ph=Math.acos(2*rand()-1),r=8+rand()*6;p[i*3]=Math.sin(ph)*Math.cos(th)*r;p[i*3+1]=Math.cos(ph)*r*.72;p[i*3+2]=Math.sin(ph)*Math.sin(th)*r}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return g
  },[])
  return <group>
    <points geometry={stars}><pointsMaterial color="#dfe6e8" size={.035} transparent opacity={.28} depthWrite={false}/></points>
    {geometries.map((g,i)=><mesh key={i} geometry={g}><meshBasicMaterial color={GOLD} transparent opacity={i===1?.18:.10} depthWrite={false}/></mesh>)}
  </group>
}
