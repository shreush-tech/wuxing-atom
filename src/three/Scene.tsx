import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ElementId } from '../clinical/types'
import { useClinical } from '../clinical/store'
import { Core } from './Core'
import { ElementBody } from './ElementBody'
import { RelationshipHalo } from './RelationshipHalo'
import { SymptomPulse } from './SymptomPulse'
import { HypothesisField } from './HypothesisField'
import { LivingDifferential } from './LivingDifferential'
import { ConvergencePulse } from './ConvergencePulse'
import { EmergentRelationship } from './EmergentRelationship'
import { RevealConductor } from './RevealConductor'
import { CameraRig } from './CameraRig'
import { ClassicalNetwork } from './ClassicalNetwork'
import { InteractionRig } from './InteractionRig'
import { ZoomRig } from './ZoomRig'
import { elementMeta } from '../content/elements'
import { detectQualityTier, qualityConfig } from '../quality'
import { createInteractionState } from './interactionState'
import { WebGLFallback } from './WebGLFallback'
import { AtmosphereDust } from './AtmosphereDust'
import { SculpturalOrbits } from './SculpturalOrbits'
import { CoreAura } from './CoreAura'
import { SelectionRipple } from './SelectionRipple'
import { DepthVeil } from './DepthVeil'
import { GalleryLightMotion } from './GalleryLightMotion'
import { ClinicalVisualDynamics } from './ClinicalVisualDynamics'
import { ClinicalRelationshipDynamics } from './ClinicalRelationshipDynamics'
import { useFocus } from '../components/FocusContext'
import { NucleusAbsorptionPulse } from './NucleusAbsorptionPulse'
import { LiveClinicalChoreography } from './LiveClinicalChoreography'
import { CosmicEnergySystem } from './CosmicEnergySystem'


function SceneThemeEnvironment(){
  const {scene}=useThree()
  useEffect(()=>{
    const apply=()=>{
      const css=getComputedStyle(document.documentElement)
      const color=(css.getPropertyValue('--user-bg')||css.getPropertyValue('--bg')||'#090b0d').trim()
      scene.background=new THREE.Color(color)
      scene.fog=new THREE.Fog(color,12,24)
    }
    apply()
    window.addEventListener('wuxing-theme-change',apply as EventListener)
    return ()=>window.removeEventListener('wuxing-theme-change',apply as EventListener)
  },[scene])
  return null
}
const ids:ElementId[]=['wood','fire','earth','metal','water']

function hasWebGL(){
  if(typeof document==='undefined')return true
  try{
    const c=document.createElement('canvas')
    return !!(c.getContext('webgl2')||c.getContext('webgl'))
  }catch{return false}
}

function World({focus,pulseKey,onFocus,waterSegments,particles}:{focus:ElementId|null,pulseKey:number,onFocus:(id:ElementId)=>void,waterSegments:number,particles:number}){
  const {clinical}=useClinical()
  const top=clinical.patterns[0]
  const resultMode=clinical.interview.canShowResult && (!!clinical.relationship || !!(top && top.raw>0))
  const sculpture=useRef<THREE.Group>(null!)
  const interaction=useRef(createInteractionState())

  return <>
    <ambientLight intensity={.34}/>
    <pointLight position={[0,5,4]} intensity={14} distance={16} decay={2} color="#f0b37b"/>
    <pointLight position={[-5,1,3]} intensity={7} distance={14} decay={2} color="#779783"/>
    <pointLight position={[5,-1,2]} intensity={6} distance={14} decay={2} color="#aab6c2"/>
    <hemisphereLight intensity={.52} color="#e9eef0" groundColor="#080a0c"/>
    <directionalLight position={[5,7,8]} intensity={1.55} color="#fff1dd"/>
    <directionalLight position={[-6,1,-4]} intensity={.48} color="#b8cad4"/>

    <group ref={sculpture} rotation={[.1,-.28,.05]}>
      <CosmicEnergySystem reduced={typeof window!=='undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}/>
      <ClassicalNetwork visibility={resultMode ? .55 : 0}/>
      <SelectionRipple/>
        <NucleusAbsorptionPulse/>
        <CoreAura/>
        <Core/>
      {ids.map(id=><ClinicalVisualDynamics key={id} element={id}>
          <LiveClinicalChoreography clinical={clinical} element={id}>
            <ElementBody id={id} state={clinical.elements[id]} onSelect={onFocus} waterSegments={waterSegments} focused={focus===id}/>
          </LiveClinicalChoreography>
        </ClinicalVisualDynamics>) }
      {clinical.relationship && <>
        <ClinicalRelationshipDynamics>
          <EmergentRelationship><RelationshipHalo relationship={clinical.relationship} maxParticles={particles}/></EmergentRelationship>
        </ClinicalRelationshipDynamics>
      </>} 
      <DepthVeil/>
        <GalleryLightMotion/>
        <AtmosphereDust/>
        <SculpturalOrbits/>
        <HypothesisField/>
        <ConvergencePulse/>
        <RevealConductor/>
        <SymptomPulse pulseKey={pulseKey}/>
    </group>

    <InteractionRig group={sculpture} interaction={interaction}/>
    <ZoomRig interaction={interaction}/>
        <CameraRig relationship={clinical.relationship} focus={focus} resultMode={resultMode} interaction={interaction}/>
  </>
}

export function Scene(){
  const {responseRevision}=useClinical()
  const [runtimeFailed,setRuntimeFailed]=useState(false)
  const {focus,setFocus}=useFocus()
  const tier=useMemo(()=>detectQualityTier(),[])
  const supported=useMemo(()=>hasWebGL(),[])
  const qc=qualityConfig[tier]
  const pulseKey=responseRevision

  const reset=()=>{
    setFocus(null)
    window.dispatchEvent(new Event('wuxing-reset-view'))
  }

  if(!supported||runtimeFailed)return <div className="scene-shell"><WebGLFallback/></div>

  return <div className="scene-shell">
    <Canvas
      camera={{position:[.2,1.4,10.2],fov:42}}
      dpr={qc.dpr}
      gl={{antialias:tier!=='low',powerPreference:'high-performance'}}
      onCreated={({gl}:any)=>{
        gl.toneMapping=THREE.ACESFilmicToneMapping
        gl.toneMappingExposure=1.05
        if('transmissionResolutionScale' in gl)gl.transmissionResolutionScale=tier==='low'?.45:tier==='medium'?.65:.82

        // WebGL contexts can be lost on mobile Safari after memory pressure,
        // tab suspension or GPU resets. Fail soft instead of leaving a blank hero.
        const canvas=gl.domElement as HTMLCanvasElement
        const onLost=(event:Event)=>{
          event.preventDefault()
          setRuntimeFailed(true)
        }
        canvas.addEventListener('webglcontextlost',onLost,{once:true})
      }}
    >
      <SceneThemeEnvironment/>
      <World focus={focus} pulseKey={pulseKey} onFocus={setFocus} waterSegments={qc.waterSegments} particles={qc.particles}/>
    </Canvas>

    <button className="reset-view" onClick={reset} aria-label="Recentrar mapa 3D">recentrar</button>
    <div className="scene-hint">arraste para girar · toque no núcleo Yin–Yang para explorar · pinça/scroll para aproximar</div>

    <div className={`focus-label ${focus?'on':''}`} aria-live="polite">
      {focus && <>
        <div className="focus-char">{elementMeta[focus].char}</div>
        <div className="focus-name">{elementMeta[focus].name}</div>
        <div className="focus-sub">{elementMeta[focus].organs}</div>
        <div className="focus-keywords">{elementMeta[focus].keywords}</div>
      </>}
    </div>
  </div>
}