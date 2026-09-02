import type {AtomCue} from './atomChoreography'
export function relationshipChoreography(cue:AtomCue){
  if(cue.kind==='relationIn')return {opacity:[0,1],particleFlow:'emerge',cameraSnap:false}
  if(cue.kind==='relationOut')return {opacity:[1,0],particleFlow:'dissolve',cameraSnap:false}
  if(cue.kind==='relationChange')return {opacity:[1,.35,1],particleFlow:'redirect',cameraSnap:false}
  return null
}
