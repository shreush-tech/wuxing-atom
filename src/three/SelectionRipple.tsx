import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useClinical } from '../clinical/store'
import { useEffect,useRef } from 'react'

export function SelectionRipple(){
  const {clinical}=useClinical()
  const ref=useRef<THREE.Mesh>(null!)
  const start=useRef(0)
  const key=String((clinical as any).selectedElement||'')
  useEffect(()=>{ if(key)start.current=performance.now() },[key])

  useFrame(()=>{
    if(!ref.current)return
    const age=(performance.now()-start.current)/1000
    if(!key || age>1.15){ref.current.visible=false;return}
    ref.current.visible=true
    const p=Math.min(1,age/1.15)
    ref.current.scale.setScalar(.9+p*2.35)
    const mat=ref.current.material as THREE.MeshBasicMaterial
    mat.opacity=(1-p)*.11
  })
  return <mesh ref={ref} rotation={[Math.PI/2,0,0]} visible={false}>
    <ringGeometry args={[.56,.575,96]}/>
    <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>
}
