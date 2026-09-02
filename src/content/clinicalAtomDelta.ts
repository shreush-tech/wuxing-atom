import type {ClinicalState,ElementId} from '../clinical/types'

export interface ClinicalAtomDelta{
  activated:ElementId[]
  deactivated:ElementId[]
  strengthened:ElementId[]
  weakened:ElementId[]
  relationship:'appeared'|'disappeared'|'changed'|'unchanged'
}

const active=(c:ClinicalState,e:ElementId)=>c.elements[e].activity
const elements:ElementId[]=['wood','fire','earth','metal','water']

export function clinicalAtomDelta(prev:ClinicalState,next:ClinicalState):ClinicalAtomDelta{
  const activated:ElementId[]=[]
  const deactivated:ElementId[]=[]
  const strengthened:ElementId[]=[]
  const weakened:ElementId[]=[]

  for(const e of elements){
    const a=active(prev,e), b=active(next,e)
    if(a<=0 && b>0)activated.push(e)
    if(a>0 && b<=0)deactivated.push(e)
    if(b>a+.08)strengthened.push(e)
    if(a>b+.08)weakened.push(e)
  }

  const p=prev.relationship?.id ?? null
  const n=next.relationship?.id ?? null
  const relationship=
    !p&&n?'appeared':
    p&&!n?'disappeared':
    p!==n?'changed':'unchanged'

  return {activated,deactivated,strengthened,weakened,relationship}
}
