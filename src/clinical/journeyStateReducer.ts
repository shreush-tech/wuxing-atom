import type {AnswerState} from './types'
import type {JourneyAction} from './dynamicClinicalJourneys'

export type JourneySelected=Record<string,AnswerState>

export function applyJourneyAction(state:JourneySelected,action:JourneyAction):JourneySelected{
  if(action.type==='remove'){
    const next={...state}
    delete next[action.id]
    return next
  }
  return {...state,[action.id]:action.value}
}

export function replayJourney(actions:JourneyAction[]){
  return actions.reduce<JourneySelected>((state,action)=>applyJourneyAction(state,action),{})
}
