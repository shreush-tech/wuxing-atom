import * as THREE from 'three'
import { useMemo } from 'react'

const specs=[
  [2.75,1.38,.56,.18,.1],
  [2.4,1.72,-.42,.48,-.18],
  [2.95,1.16,.32,-.22,.52],
  [2.58,1.48,-.58,-.34,-.12],
  [2.72,1.32,.62,.24,-.46],
]

export function SculpturalOrbits(){
  const curves=useMemo(()=>specs.map(([rx,ry,ax,ay,az])=>{
    const pts:THREE.Vector3[]=[]
    for(let i=0;i<=96;i++){
      const t=i/96*Math.PI*2
      const p=new THREE.Vector3(Math.cos(t)*rx,Math.sin(t)*ry,0)
      p.applyEuler(new THREE.Euler(ax,ay,az))
      pts.push(p)
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }),[])
  return <group>
    {curves.map((g,i)=><line key={i} geometry={g}>
      <lineBasicMaterial transparent opacity={.085} depthWrite={false}/>
    </line>)}
  </group>
}
