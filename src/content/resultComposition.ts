import type { ClinicalState } from '../clinical/types'
import { clinicalVisualBridge,type ElementKey } from './clinicalVisualBridge'

export function resultComposition(c:ClinicalState){
  const map=clinicalVisualBridge(c)
  const entries=(Object.entries(map.elements) as [ElementKey,(typeof map.elements)[ElementKey]][])
    .sort((a,b)=>b[1].presence-a[1].presence)
  const leading=entries.slice(0,2).map(([k])=>k)
  return {
    leading,
    opacityFor:(k:ElementKey)=>!map.resultReady?1:leading.includes(k)?1:.78,
    scaleFor:(k:ElementKey)=>!map.resultReady?1:leading.includes(k)?1.035:.94
  }
}
