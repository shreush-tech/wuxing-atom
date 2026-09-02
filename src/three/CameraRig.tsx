import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ElementId, RelationshipState } from '../clinical/types'
import { orbitPosition } from './ElementBody'
import type { InteractionStateRef } from './interactionState'

export function CameraRig({
  relationship,focus,resultMode,interaction
}:{relationship:RelationshipState|null,focus:ElementId|null,resultMode:boolean,interaction:InteractionStateRef}){
  const {camera,size}=useThree()
  const target=useRef(new THREE.Vector3())
  const entry=useRef(0)
  const prevMode=useRef(false)

  useFrame(({clock},dt)=>{
    const t=clock.getElapsedTime()
    if(resultMode && !prevMode.current) entry.current=t
    prevMode.current=resultMode

    const sinceManual=performance.now()-interaction.current.lastManualAt
    if(interaction.current.isManipulating || interaction.current.resetting || sinceManual<1500)return

    const aspect=size.width/Math.max(1,size.height)
    const portrait=aspect<.82
    const neutralZ=portrait?11.85:10.2
    const neutralY=portrait?.30:1.4
    let desiredPos:THREE.Vector3|null=null
    let desiredTarget=new THREE.Vector3(0,portrait?.10:0,0)

    if(relationship){
      const a=orbitPosition(relationship.source,t*.10)
      const b=orbitPosition(relationship.target,t*.10)
      desiredTarget=a.clone().lerp(b,.5)
      const dir=a.clone().sub(b).normalize()
      const normal=new THREE.Vector3(-dir.z,.22,dir.x).normalize()
      const reveal=Math.min(1,Math.max(0,(t-entry.current)/2.4))
      const dist=(portrait?9.45:8.6)-(1.2*reveal)
      desiredPos=desiredTarget.clone().add(normal.multiplyScalar(dist)).add(new THREE.Vector3(0,1.1,0))
    } else if(focus){
      const p=orbitPosition(focus,t*.10)
      desiredTarget=p.clone()
      desiredPos=p.clone().normalize().multiplyScalar(portrait?8.35:7.6).add(new THREE.Vector3(0,portrait?.55:1.15,0))
    } else if(resultMode){
      desiredPos=new THREE.Vector3(portrait?.12:.6,portrait?.28:1.1,portrait?10.75:9.0)
    } else if(!interaction.current.manualCamera){
      desiredPos=new THREE.Vector3(portrait?0:.2,neutralY,neutralZ)
    }

    // Preserve manual zoom in neutral mode; cinematic intent returns only for focus/result.
    if(desiredPos){
      const posEase=1-Math.exp(-dt*(resultMode?1.7:2.25))
      camera.position.lerp(desiredPos,posEase)
    }
    const targetEase=1-Math.exp(-dt*(resultMode?2.35:3.1))
    target.current.lerp(desiredTarget,targetEase)
    camera.lookAt(target.current)
  })
  return null
}
