export const MAX_PATTERNS_PER_ELEMENT=2 as const
import {patterns} from './patterns'
import type {ElementId,PatternScore,SystemDiagnosis} from './types'

const elementOrder:ElementId[]=['wood','fire','earth','metal','water']

export function selectMultiSystemDiagnoses(scores:PatternScore[]):SystemDiagnosis[]{
  const byElement=new Map<ElementId,PatternScore[]>()
  for(const e of elementOrder)byElement.set(e,[])

  for(const s of scores){
    if(s.raw<=0)continue
    const def=patterns.find(p=>p.id===s.id)
    if(!def)continue
    byElement.get(def.element)!.push(s)
  }

  const result:SystemDiagnosis[]=[]
  for(const e of elementOrder){
    const ranked=(byElement.get(e)||[]).sort((a,b)=>b.raw-a.raw)
    if(!ranked.length)continue

    const first=ranked[0]
    const accepted:PatternScore[]=[]
    if(first.raw>=3)accepted.push(first)

    // A second diagnosis in the same element is allowed when independently supported.
    for(const candidate of ranked.slice(1)){
      if(accepted.length>=MAX_PATTERNS_PER_ELEMENT)break
      const supports=candidate.evidence.filter(x=>x.kind==='support' && x.contribution>0)
      const independent=new Set(supports.map(x=>x.symptomId)).size>=2
      const closeEnough=candidate.raw>=3 && candidate.raw>=first.raw*.48
      if(independent && closeEnough)accepted.push(candidate)
    }

    if(accepted.length)result.push({element:e,patterns:accepted})
  }
  return result
}

export function flattenActivePatterns(systems:SystemDiagnosis[]){
  return systems.flatMap(x=>x.patterns).sort((a,b)=>b.raw-a.raw)
}
