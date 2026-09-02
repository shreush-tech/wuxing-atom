import type { ClinicalState } from '../clinical/types'
import { patternLabels } from './resultLabels'

export interface EvidenceTraceItem{
  symptomId:string
  contribution:number
  direction:'supports'|'contradicts'
}

export interface PatternEvidenceTrace{
  patternId:string
  label:string
  items:EvidenceTraceItem[]
}

export function buildEvidenceTrace(c:ClinicalState):PatternEvidenceTrace[]{
  return c.patterns
    .filter(p=>p.raw>0)
    .slice(0,3)
    .map(p=>{
      const source=(p as any).evidence || (p as any).contributions || []
      const items:EvidenceTraceItem[]=source
        .map((x:any)=>({
          symptomId:String(x.symptom || x.symptomId || x.id || ''),
          contribution:Number(x.contribution ?? x.weight ?? 0),
          direction:Number(x.contribution ?? x.weight ?? 0) < 0 ? 'contradicts' : 'supports'
        }))
        .filter((x:EvidenceTraceItem)=>x.symptomId && x.contribution!==0)
        .sort((a:EvidenceTraceItem,b:EvidenceTraceItem)=>Math.abs(b.contribution)-Math.abs(a.contribution))
        .slice(0,6)

      return {
        patternId:String(p.id),
        label:patternLabels[p.id]?.short || (p as any).label || String(p.id),
        items
      }
    })
}
