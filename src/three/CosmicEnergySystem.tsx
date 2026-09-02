import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GOLD='#e0b75d'
class Orbit extends THREE.Curve<THREE.Vector3>{
  constructor(public a:number,public b:number,public rot:THREE.Euler){super()}
  getPoint(t:number,target=new THREE.Vector3()){const q=t*Math.PI*2;target.set(this.a*Math.cos(q),this.b*Math.sin(q),.16*Math.sin(q*2));return target.applyEuler(this.rot)}
}
export function CosmicEnergySystem(){
  const glow=useRef<THREE.Group>(null!)
  const curves=useMemo(()=>[
    new Orbit(3.5,2.7,new THREE.Euler(1.05,.08,.02)),
    new Orbit(3.8,3.15,new THREE.Euler(.22,.36,.02)),
    new Orbit(3.9,3.0,new THREE.Euler(.72,-.18,.64)),
    new Orbit(3.0,2.42,new THREE.Euler(.44,.56,-.46)),
  ],[])
  const geometries=useMemo(()=>curves.map((c,i)=>new THREE.TubeGeometry(c,44,i===1?.022:.014,4,true)),[curves])
  const stars=useMemo(()=>{
    const n=54,p=new Float32Array(n*3);let seed=421
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
    for(let i=0;i<n;i++){const th=rand()*Math.PI*2,ph=Math.acos(2*rand()-1),r=8+rand()*6;p[i*3]=Math.sin(ph)*Math.cos(th)*r;p[i*3+1]=Math.cos(ph)*r*.72;p[i*3+2]=Math.sin(ph)*Math.sin(th)*r}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return g
  },[])
  const energy=useMemo(()=>{
    const g=new THREE.BufferGeometry(), pts=[] as number[]
    for(let i=0;i<22;i++){const c=curves[i%curves.length],p=c.getPoint((i*.137)%1);pts.push(p.x,p.y,p.z)}
    g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(pts),3));return g
  },[curves])
  useFrame(({clock})=>{if(glow.current)glow.current.rotation.y=Math.sin(clock.elapsedTime*.11)*.025})
  return <group ref={glow}>
    <points geometry={stars}><pointsMaterial color="#e9dcc1" size={.04} transparent opacity={.22} depthWrite={false}/></points>
    {geometries.map((g,i)=><mesh key={i} geometry={g}><meshBasicMaterial color={GOLD} transparent opacity={i===1?.31:.20} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>)}
    <points geometry={energy}><pointsMaterial color="#ffd879" size={.075} transparent opacity={.75} depthWrite={false} blending={THREE.AdditiveBlending}/></points>
  </group>
}
