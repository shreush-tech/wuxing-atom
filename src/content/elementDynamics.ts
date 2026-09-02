import type { ClinicalState } from '../clinical/types'
import { buildDiagnosticVisualization } from './diagnosticVisualization'
import { patternElementMap } from './patternElementMap'

export interface ElementDynamicState{
  presence:number
  orbitBreath:number
  materialBreath:number
  tension:number
  isLeading:boolean
  isCompeting:boolean
}

export type ElementKey='wood'|'fire'|'earth'|'metal'|'water'

export function buildElementDynamics(c:ClinicalState):Record<ElementKey,ElementDynamicState>{
  const base=()=>({presence:.48,orbitBreath:.12,materialBreath:.1,tension:0,isLeading:false,isCompeting:false})
  const out:Record<ElementKey,ElementDynamicState>={
    wood:base(),fire:base(),earth:base(),metal:base(),water:base()
  }
  const v=buildDiagnosticVisualization(c)
  v.hypotheses.slice(0,3).forEach((h,i)=>{
    const el=patternElementMap[h.id]||'earth'
    const d=out[el]
    d.presence=Math.max(d.presence,.52+h.relative*.42)
    d.orbitBreath=Math.max(d.orbitBreath,.12+h.relative*.28)
    d.materialBreath=Math.max(d.materialBreath,.1+h.relative*.24)
    d.tension=Math.max(d.tension,h.stage==='competing'?.45:h.stage==='leading'?.25:0)
    d.isLeading=d.isLeading||h.stage==='leading'||h.stage==='resolved'
    d.isCompeting=d.isCompeting||h.stage==='competing'
  })
  return out
}
