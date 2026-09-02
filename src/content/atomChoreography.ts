import type {ElementId} from '../clinical/types'
import type {ClinicalAtomDelta} from './clinicalAtomDelta'

export type AtomCueKind='activate'|'deactivate'|'strengthen'|'weaken'|'relationIn'|'relationOut'|'relationChange'
export interface AtomCue{kind:AtomCueKind;element?:ElementId;durationMs:number;intensity:number}

const clamp=(n:number,min=0,max=1)=>Math.max(min,Math.min(max,n))

/**
 * Converts a clinical delta into restrained visual cues.
 * This is presentation logic only: it cannot create or alter a diagnosis.
 */
export function choreographAtom(delta:ClinicalAtomDelta):AtomCue[]{
  const cues:AtomCue[]=[]
  delta.activated.forEach(element=>cues.push({kind:'activate',element,durationMs:1050,intensity:.72}))
  delta.deactivated.forEach(element=>cues.push({kind:'deactivate',element,durationMs:900,intensity:.62}))
  delta.strengthened.forEach(element=>cues.push({kind:'strengthen',element,durationMs:850,intensity:.42}))
  delta.weakened.forEach(element=>cues.push({kind:'weaken',element,durationMs:850,intensity:.38}))
  if(delta.relationship==='appeared')cues.push({kind:'relationIn',durationMs:1200,intensity:.62})
  if(delta.relationship==='disappeared')cues.push({kind:'relationOut',durationMs:850,intensity:.5})
  if(delta.relationship==='changed')cues.push({kind:'relationChange',durationMs:1100,intensity:.55})
  return cues.map(c=>({...c,intensity:clamp(c.intensity)}))
}

export const choreographyLimits={
  maxElementScaleDelta:.16,
  minTransitionMs:700,
  maxTransitionMs:1400,
  noScoreProportionalScaling:true,
  relationshipNeverCreatedByAnimation:true,
  preserveManualCamera:true
} as const
