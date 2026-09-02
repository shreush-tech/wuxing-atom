import type { MutableRefObject } from 'react'

export interface InteractionState {
  isManipulating:boolean
  activePointers:Set<number>
  lastManualAt:number
  manualCamera:boolean
  resetting:boolean
}

export type InteractionStateRef=MutableRefObject<InteractionState>

export function createInteractionState():InteractionState{
  return {
    isManipulating:false,
    activePointers:new Set<number>(),
    lastManualAt:0,
    manualCamera:false,
    resetting:false,
  }
}
