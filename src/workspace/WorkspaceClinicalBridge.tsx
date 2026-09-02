import {useEffect,useRef} from 'react'
import {useClinical} from '../clinical/store'
import {useWorkspace} from './WorkspaceProvider'
import {latestSession} from './model'

export function WorkspaceClinicalBridge(){
  const {state}=useWorkspace()
  const {loadSnapshot}=useClinical()
  const loadedKey=useRef<string|null>(null)

  useEffect(()=>{
    const patientId=state.activePatientId
    if(!patientId){
      loadedKey.current=null
      return
    }

    const historical=state.viewSessionId
      ?state.sessions.find(s=>s.id===state.viewSessionId&&s.patientId===patientId)||null
      :null
    const snapshot=historical||latestSession(state.sessions,patientId)
    const key=`${patientId}:${snapshot?.id||'new'}:${state.viewSessionId?'history':'latest'}`

    if(loadedKey.current===key)return
    loadSnapshot(snapshot?.answers||{},snapshot?.clinicalDiagnosisIds||[])
    loadedKey.current=key
  },[state.activePatientId,state.viewSessionId,state.sessions])

  return null
}
