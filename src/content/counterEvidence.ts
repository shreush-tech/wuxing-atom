import type { ClinicalState } from '../clinical/types'
import { patternLabels } from './resultLabels'

export interface CounterEvidenceView{
  label:string
  contradictions:string[]
  missing:string[]
}

export function buildCounterEvidence(c:ClinicalState):CounterEvidenceView[]{
  return c.patterns.filter(p=>p.raw>0).slice(0,2).map((p:any)=>({
    label:patternLabels[p.id]?.short || p.label || String(p.id),
    contradictions:(p.contradictions || p.counterEvidence || []).map(String).slice(0,4),
    missing:(p.missing || p.missingDiscriminators || []).map(String).slice(0,4)
  })).filter(x=>x.contradictions.length || x.missing.length)
}
