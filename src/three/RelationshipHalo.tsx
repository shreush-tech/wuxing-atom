import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { RelationshipState } from '../clinical/types'
import { orbitPosition } from './ElementBody'
import { elementMeta } from '../content/elements'

function grammar(type:RelationshipState['type']){
  if(type==='generation') return {radius:.046,speed:.13,particles:14,amp:.08,reverse:false}
  if(type==='control') return {radius:.025,speed:.18,particles:10,amp:.03,reverse:false}
  if(type==='overacting') return {radius:.039,speed:.30,particles:16,amp:.16,reverse:false}
  if(type==='countercontrol') return {radius:.031,speed:.24,particles:13,amp:.12,reverse:true}
  return {radius:.028,speed:.17,particles:12,amp:.06,reverse:false}
}

const SEGMENTS=42

export function RelationshipHalo({relationship,maxParticles=12}:{relationship:RelationshipState,maxParticles?:number}){
  const line=useRef<THREE.Line>(null!)
  const particles=useRef<THREE.Mesh[]>([])
  const base=grammar(relationship.type)
  const count=Math.max(5,Math.min(base.particles,maxParticles))

  const positions=useMemo(()=>new Float32Array((SEGMENTS+1)*3),[])
  const geometry=useMemo(()=>{
    const g=new THREE.BufferGeometry()
    g.setAttribute('position',new THREE.BufferAttribute(positions,3))
    return g
  },[positions])

  useFrame(({clock})=>{
    const t=clock.getElapsedTime()
    const a=orbitPosition(relationship.source,t*.10)
    const b=orbitPosition(relationship.target,t*.10)
    const mid=a.clone().lerp(b,.5).multiplyScalar(1.06+base.amp).add(new THREE.Vector3(0,.24+base.amp,0))
    const curve=new THREE.CatmullRomCurve3([a,mid,b])

    const attr=geometry.getAttribute('position') as THREE.BufferAttribute
    for(let i=0;i<=SEGMENTS;i++){
      const p=curve.getPoint(i/SEGMENTS)
      attr.setXYZ(i,p.x,p.y,p.z)
    }
    attr.needsUpdate=true

    particles.current.slice(0,count).forEach((p,i)=>{
      let u=(t*base.speed+i/count)%1
      if(base.reverse)u=1-u
      p.position.copy(curve.getPoint(u))
      const pulse=.68+.32*Math.sin(t*(relationship.type==='overacting'?5:3)+i*.7)
      p.scale.setScalar(pulse)
    })
  })

  const sourceColor=elementMeta[relationship.source].color
  return <group>
    <line ref={line} geometry={geometry}>
      <lineBasicMaterial color={sourceColor} transparent opacity={.22+relationship.strength*.26}/>
    </line>
    {Array.from({length:count}).map((_,i)=><mesh key={i} ref={el=>{if(el)particles.current[i]=el}}>
      <sphereGeometry args={[relationship.type==='generation' ? .040 : .031,7,7]}/>
      <meshBasicMaterial color={sourceColor} transparent opacity={.68}/>
    </mesh>)}
  </group>
}
