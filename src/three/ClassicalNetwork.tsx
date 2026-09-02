import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { keCycle, shengCycle, type ClassicalEdge } from '../clinical/wuxingTopology'
import { orbitPosition } from './ElementBody'

function EdgeLine({edge,opacity}:{edge:ClassicalEdge,opacity:number}){
  const ref=useRef<THREE.Line>(null!)
  useFrame(({clock})=>{
    const t=clock.getElapsedTime()
    const a=orbitPosition(edge.source,t*.10)
    const b=orbitPosition(edge.target,t*.10)
    const mid=a.clone().lerp(b,.5)
    const lift=edge.cycle==='sheng' ? .14 : .04
    mid.add(new THREE.Vector3(0,lift,0))
    const curve=new THREE.QuadraticBezierCurve3(a,mid,b)
    ref.current.geometry.setFromPoints(curve.getPoints(28))
  })
  return <line ref={ref}>
    <bufferGeometry/>
    <lineBasicMaterial color={edge.cycle==='sheng'?'#777267':'#5d5951'} transparent opacity={opacity*(edge.cycle==='sheng' ? .62 : .42)}/>
  </line>
}

export function ClassicalNetwork({visibility}:{visibility:number}){
  const edges=useMemo(()=>[...shengCycle,...keCycle],[])
  if(visibility<=.001)return null
  return <group>{edges.map(e=><EdgeLine key={e.id} edge={e} opacity={visibility*.12}/>)}</group>
}
