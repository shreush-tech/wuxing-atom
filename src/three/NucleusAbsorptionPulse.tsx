import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useEffect,useRef} from 'react'
import {useClinical} from '../clinical/store'

export function NucleusAbsorptionPulse(){
  const {responseRevision}=useClinical()
  const mesh=useRef<THREE.Mesh>(null!)
  const pulse=useRef(0)

  useEffect(()=>{pulse.current=1},[responseRevision])

  useFrame((_,dt)=>{
    if(!mesh.current)return
    pulse.current=Math.max(0,pulse.current-dt*1.9)
    const p=pulse.current
    const s=.9+p*.24
    mesh.current.scale.setScalar(s)
    const mat=mesh.current.material as THREE.MeshBasicMaterial
    mat.opacity=.035+p*.10
  })

  return <mesh ref={mesh} position={[0,0,0]} renderOrder={7}>
    <sphereGeometry args={[1.02,32,32]}/>
    <meshBasicMaterial transparent opacity={.035} depthWrite={false}/>
  </mesh>
}
