import type {ClinicalState,ElementId} from '../clinical/types'
export function clinicalToAtomContract(c:ClinicalState){
 const activeElements=(Object.entries(c.elements) as [ElementId,ClinicalState['elements'][ElementId]][])
  .filter(([,s])=>s.activity>0).sort((a,b)=>b[1].activity-a[1].activity).map(([id])=>id)
 return {activeElements,relationshipVisible:!!c.relationship,visualPriority:activeElements.slice(0,2)}
}
