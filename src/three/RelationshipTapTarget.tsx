import {useMemo} from 'react'
import * as THREE from 'three'
import {useClinical} from '../clinical/store'
import {useFocus} from '../components/FocusContext'
import type {FocusElement} from '../content/elementFocusCopy'
import type {RelationshipKind} from '../content/relationshipFocusCopy'

function relationFromClinical(c:any){
  const r=Array.isArray(c.relationships)?c.relationships[0]:c.relationship
  if(!r)return null
  const source=(r.source||r.from) as FocusElement
  const target=(r.target||r.to) as FocusElement
  const raw=String(r.pathologicalRelation||r.classicalRelation||r.kind||'control').toLowerCase()
  const kind:RelationshipKind=
    raw.includes('over')||raw.includes('cheng')?'overacting':
    raw.includes('counter')||raw.includes('wu')?'countercontrol':
    raw.includes('generation')||raw.includes('sheng')?'generation':'control'
  if(!source||!target)return null
  return {source,target,kind}
}

export function RelationshipTapTarget(){
  const {clinical}=useClinical()
  const {setRelationshipFocus}=useFocus()
  const rel=useMemo(()=>relationFromClinical(clinical),[clinical])
  if(!rel)return null

  return <mesh
    position={[0,0,0]}
    onClick={(e)=>{e.stopPropagation();setRelationshipFocus(rel)}}
    renderOrder={20}
  >
    <torusGeometry args={[2.6,.22,8,64]}/>
    <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
  </mesh>
}
