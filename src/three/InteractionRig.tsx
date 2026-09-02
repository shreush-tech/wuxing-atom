import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { InteractionStateRef } from './interactionState'

const START_ROTATION=new THREE.Euler(.1,-.28,.05)
const MAX_DT=.05

export function InteractionRig({group,interaction}:{group:RefObject<THREE.Group>,interaction:InteractionStateRef}){
  const {gl}=useThree()
  const dragging=useRef(false)
  const pointerId=useRef<number|null>(null)
  const last=useRef({x:0,y:0,t:0})
  // radians / second: this makes inertia refresh-rate independent.
  const velocity=useRef({x:0,y:0,z:0})
  const idle=useRef(0)
  const resetTarget=useRef(false)

  useEffect(()=>{
    const el=gl.domElement

    const down=(e:PointerEvent)=>{
      interaction.current.activePointers.add(e.pointerId)
      interaction.current.lastManualAt=performance.now()
      interaction.current.isManipulating=true
      idle.current=0

      if(interaction.current.activePointers.size===1){
        dragging.current=true
        pointerId.current=e.pointerId
        last.current={x:e.clientX,y:e.clientY,t:performance.now()}
        velocity.current={x:0,y:0,z:0}
        el.setPointerCapture?.(e.pointerId)
      } else dragging.current=false
    }

    const move=(e:PointerEvent)=>{
      if(!interaction.current.activePointers.has(e.pointerId))return
      interaction.current.lastManualAt=performance.now()
      if(interaction.current.activePointers.size!==1 || !dragging.current || pointerId.current!==e.pointerId || !group.current)return

      const now=performance.now()
      const dx=e.clientX-last.current.x
      const dy=e.clientY-last.current.y
      const eventDt=Math.max(.008,Math.min(.05,(now-last.current.t)/1000))
      last.current={x:e.clientX,y:e.clientY,t:now}

      const yaw=dx*.0040
      const pitch=dy*.0038
      const roll=(dx-dy)*.00042
      group.current.rotation.y+=yaw
      group.current.rotation.x+=pitch
      group.current.rotation.z+=roll

      // Low-pass the instantaneous pointer velocity so release has elegant inertia.
      const clampV=(v:number)=>THREE.MathUtils.clamp(v,-1.32,1.32)
      const targetX=clampV(yaw/eventDt),targetY=clampV(pitch/eventDt),targetZ=THREE.MathUtils.clamp(roll/eventDt,-.35,.35)
      velocity.current.x=THREE.MathUtils.damp(velocity.current.x,targetX,10,eventDt)
      velocity.current.y=THREE.MathUtils.damp(velocity.current.y,targetY,10,eventDt)
      velocity.current.z=THREE.MathUtils.damp(velocity.current.z,targetZ,10,eventDt)
    }

    const up=(e:PointerEvent)=>{
      interaction.current.activePointers.delete(e.pointerId)
      if(pointerId.current===e.pointerId){
        dragging.current=false
        pointerId.current=null
        try{el.releasePointerCapture?.(e.pointerId)}catch{}
      }
      interaction.current.isManipulating=interaction.current.activePointers.size>0
      interaction.current.lastManualAt=performance.now()
    }

    const reset=()=>{
      resetTarget.current=true
      velocity.current={x:0,y:0,z:0}
      idle.current=0
    }

    el.addEventListener('pointerdown',down)
    el.addEventListener('pointermove',move)
    el.addEventListener('pointerup',up)
    el.addEventListener('pointercancel',up)
    window.addEventListener('wuxing-reset-view',reset as EventListener)
    return ()=>{
      el.removeEventListener('pointerdown',down)
      el.removeEventListener('pointermove',move)
      el.removeEventListener('pointerup',up)
      el.removeEventListener('pointercancel',up)
      window.removeEventListener('wuxing-reset-view',reset as EventListener)
    }
  },[gl,group,interaction])

  useFrame((_,rawDt)=>{
    if(!group.current)return
    const dt=Math.min(rawDt,MAX_DT)

    if(resetTarget.current){
      group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,START_ROTATION.x,7.2,dt)
      group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,START_ROTATION.y,7.2,dt)
      group.current.rotation.z=THREE.MathUtils.damp(group.current.rotation.z,START_ROTATION.z,7.2,dt)
      if(Math.abs(group.current.rotation.x-START_ROTATION.x)<.0025 && Math.abs(group.current.rotation.y-START_ROTATION.y)<.0025 && Math.abs(group.current.rotation.z-START_ROTATION.z)<.0025){
        group.current.rotation.copy(START_ROTATION)
        resetTarget.current=false
      }
      return
    }

    if(!dragging.current && interaction.current.activePointers.size<2){
      group.current.rotation.y+=velocity.current.x*dt
      group.current.rotation.x+=velocity.current.y*dt
      group.current.rotation.z+=velocity.current.z*dt

      // Exponential drag gives the same decay at 60, 90 or 120 Hz.
      const drag=Math.exp(-3.9*dt)
      velocity.current.x*=drag
      velocity.current.y*=drag
      velocity.current.z*=drag
      idle.current+=dt

      // Gallery-like idle breathing only after inertia is spent.
      if(idle.current>2.4 && Math.abs(velocity.current.x)<.006 && Math.abs(velocity.current.y)<.006){
        group.current.rotation.y+=dt*.013
        group.current.rotation.x+=Math.sin(idle.current*.35)*dt*.0008
      }
    }
    group.current.rotation.x=THREE.MathUtils.clamp(group.current.rotation.x,-1.28,1.28)
    group.current.rotation.z=THREE.MathUtils.clamp(group.current.rotation.z,-.48,.48)
  })

  return null
}
