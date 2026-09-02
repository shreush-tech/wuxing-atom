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
import { detectQualityTier, qualityConfig } from '../quality'
import { createInteractionState } from './interactionState'
import { WebGLFallback } from './WebGLFallback'
import { CoreAura } from './CoreAura'
import { SelectionRipple } from './SelectionRipple'
import { ClinicalVisualDynamics } from './ClinicalVisualDynamics'
import { ClinicalRelationshipDynamics } from './ClinicalRelationshipDynamics'
import { useFocus } from '../components/FocusContext'
import { NucleusAbsorptionPulse } from './NucleusAbsorptionPulse'
import { LiveClinicalChoreography } from './LiveClinicalChoreography'
import { CosmicEnergySystem } from './CosmicEnergySystem'


function SceneThemeEnvironment(){
  const {scene}=useThree()
  useEffect(()=>{
    const color='#07090b'
    scene.background=new THREE.Color(color)
    scene.fog=new THREE.Fog(color,12,24)
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
    <ambientLight intensity={.68}/>
    <hemisphereLight intensity={.62} color="#f2eadc" groundColor="#080a0c"/>
    <directionalLight position={[5,6,7]} intensity={1.35} color="#fff0d8"/>

    <group ref={sculpture} rotation={[.1,-.28,.05]}>
      <CosmicEnergySystem/>
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
      camera={{position:[0,.55,11.35],fov:40}}
      dpr={tier==='low'?.72:tier==='medium'?.82:.92}
      gl={{antialias:false,powerPreference:'high-performance',alpha:false,stencil:false}}
      onCreated={({gl}:any)=>{
        gl.toneMapping=THREE.ACESFilmicToneMapping
        gl.toneMappingExposure=1.05
        if('transmissionResolutionScale' in gl)gl.transmissionResolutionScale=.25

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
    <div className="scene-hint">arraste para girar · clique em um elemento para explorar</div>

  </div>
}