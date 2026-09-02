import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { InteractionStateRef } from './interactionState'

const HOME=new THREE.Vector3(0,.55,11.35)

export function ZoomRig({interaction}:{interaction:InteractionStateRef}){
  const {camera,gl}=useThree()
  const points=useRef<Map<number,{x:number,y:number}>>(new Map())
  const prevDist=useRef<number|null>(null)
  const resetTarget=useRef(false)
  const lastTap=useRef(0)

  useEffect(()=>{
    const el=gl.domElement
    const clampDistance=()=>{
      const len=camera.position.length()
      const clamped=THREE.MathUtils.clamp(len,10.65,11.85)
      camera.position.setLength(clamped)
    }
    const markManual=()=>{
      interaction.current.manualCamera=true
      interaction.current.lastManualAt=performance.now()
    }
    const wheel=(e:WheelEvent)=>{
      e.preventDefault()
      markManual()
      const factor=1+Math.sign(e.deltaY)*.022
      camera.position.multiplyScalar(factor)
      clampDistance()
    }
    const down=(e:PointerEvent)=>{
      points.current.set(e.pointerId,{x:e.clientX,y:e.clientY})
      if(points.current.size===2){
        interaction.current.isManipulating=true
        markManual()
      }

      // Touch double-tap reset. Desktop uses dblclick below.
      if(e.pointerType==='touch' && points.current.size===1){
        const now=performance.now()
        if(now-lastTap.current<330)window.dispatchEvent(new Event('wuxing-reset-view'))
        lastTap.current=now
      }
    }
    const move=(e:PointerEvent)=>{
      if(!points.current.has(e.pointerId))return
      points.current.set(e.pointerId,{x:e.clientX,y:e.clientY})
      const pts=[...points.current.values()]
      if(pts.length===2){
        markManual()
        const dx=pts[0].x-pts[1].x, dy=pts[0].y-pts[1].y
        const d=Math.hypot(dx,dy)
        if(prevDist.current){
          const ratio=prevDist.current/d
          camera.position.multiplyScalar(THREE.MathUtils.clamp(ratio,.975,1.025))
          clampDistance()
        }
        prevDist.current=d
      }
    }
    const up=(e:PointerEvent)=>{
      points.current.delete(e.pointerId)
      if(points.current.size<2)prevDist.current=null
      interaction.current.isManipulating=interaction.current.activePointers.size>0
      interaction.current.lastManualAt=performance.now()
    }
    const reset=()=>{
      resetTarget.current=true
      interaction.current.manualCamera=false
      interaction.current.resetting=true
      interaction.current.lastManualAt=performance.now()
    }
    const dbl=()=>window.dispatchEvent(new Event('wuxing-reset-view'))

    el.addEventListener('wheel',wheel,{passive:false})
    el.addEventListener('pointerdown',down)
    el.addEventListener('pointermove',move)
    el.addEventListener('pointerup',up)
    el.addEventListener('pointercancel',up)
    el.addEventListener('dblclick',dbl)
    window.addEventListener('wuxing-reset-view',reset as EventListener)
    return ()=>{
      el.removeEventListener('wheel',wheel)
      el.removeEventListener('pointerdown',down)
      el.removeEventListener('pointermove',move)
      el.removeEventListener('pointerup',up)
      el.removeEventListener('pointercancel',up)
      el.removeEventListener('dblclick',dbl)
      window.removeEventListener('wuxing-reset-view',reset as EventListener)
    }
  },[camera,gl,interaction])

  useFrame((_,dt)=>{
    if(!resetTarget.current)return
    camera.position.x=THREE.MathUtils.damp(camera.position.x,HOME.x,8,dt)
    camera.position.y=THREE.MathUtils.damp(camera.position.y,HOME.y,8,dt)
    camera.position.z=THREE.MathUtils.damp(camera.position.z,HOME.z,8,dt)
    camera.lookAt(0,0,0)
    if(camera.position.distanceTo(HOME)<.015){
      camera.position.copy(HOME)
      resetTarget.current=false
      interaction.current.resetting=false
    }
  })

  return null
}
