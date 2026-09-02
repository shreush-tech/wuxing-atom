import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { computeClinicalState } from './engine'
import type { AnswerState } from './types'

type Ctx = {
  selected: Record<string,AnswerState>
  clinicalDiagnosisIds:string[]
  setAnswer:(id:string,value:AnswerState)=>void
  removeAnswer:(id:string)=>void
  toggleClinicalDiagnosis:(id:string)=>void
  clearClinicalDiagnoses:()=>void
  clear:()=>void
  loadSnapshot:(answers:Record<string,AnswerState>,diagnosisIds?:string[])=>void
  responseRevision:number
  clinical:ReturnType<typeof computeClinicalState>
}

const ClinicalContext = createContext<Ctx|null>(null)

export function ClinicalProvider({children}:{children:ReactNode}){
  const [selected,setSelected] = useState<Record<string,AnswerState>>({})
  const [clinicalDiagnosisIds,setClinicalDiagnosisIds] = useState<string[]>([])
  const [responseRevision,setResponseRevision] = useState(0)
  const clinical = useMemo(()=>computeClinicalState(selected),[selected])
  return <ClinicalContext.Provider value={{
    selected,
    clinicalDiagnosisIds,
    setAnswer:(id,value)=>{setSelected(s=>({...s,[id]:value}));setResponseRevision(r=>r+1)},
    removeAnswer:(id)=>{setSelected(s=>{const next={...s};delete next[id];return next});setResponseRevision(r=>r+1)},
    toggleClinicalDiagnosis:(id)=>{setClinicalDiagnosisIds(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);setResponseRevision(r=>r+1)},
    clearClinicalDiagnoses:()=>{setClinicalDiagnosisIds([]);setResponseRevision(r=>r+1)},
    clear:()=>{setSelected({});setClinicalDiagnosisIds([]);setResponseRevision(r=>r+1)},
    loadSnapshot:(answers,diagnosisIds=[])=>{setSelected({...answers});setClinicalDiagnosisIds([...diagnosisIds]);setResponseRevision(r=>r+1)},
    responseRevision,
    clinical
  }}>{children}</ClinicalContext.Provider>
}

export function useClinical(){
  const ctx=useContext(ClinicalContext)
  if(!ctx) throw new Error('useClinical must be used inside ClinicalProvider')
  return ctx
}
