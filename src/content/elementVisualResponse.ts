import type {ElementId} from '../clinical/types'
import type {AtomCue} from './atomChoreography'

export interface ElementVisualResponse{
  scaleDelta:number
  presenceDelta:number
  pulseDelta:number
  orbitEnergyDelta:number
}

const base:Record<AtomCue['kind'],ElementVisualResponse>={
  activate:{scaleDelta:.10,presenceDelta:.18,pulseDelta:.12,orbitEnergyDelta:.05},
  deactivate:{scaleDelta:-.08,presenceDelta:-.16,pulseDelta:-.08,orbitEnergyDelta:-.04},
  strengthen:{scaleDelta:.045,presenceDelta:.08,pulseDelta:.07,orbitEnergyDelta:.025},
  weaken:{scaleDelta:-.035,presenceDelta:-.07,pulseDelta:-.05,orbitEnergyDelta:-.02},
  relationIn:{scaleDelta:0,presenceDelta:0,pulseDelta:0,orbitEnergyDelta:0},
  relationOut:{scaleDelta:0,presenceDelta:0,pulseDelta:0,orbitEnergyDelta:0},
  relationChange:{scaleDelta:0,presenceDelta:0,pulseDelta:0,orbitEnergyDelta:0}
}

export function elementVisualResponse(_element:ElementId,cue:AtomCue):ElementVisualResponse{
  return base[cue.kind]
}
