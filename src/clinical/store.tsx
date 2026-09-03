import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { computeClinicalState } from './engine'
import type { AnswerState } from './types'

export type ClinicalPainReport={id:string;location:string;intensity:number}

type Ctx = {
  selected: Record<string,AnswerState>
  clinicalDiagnosisIds:string[]
  painReports:ClinicalPainReport[]
  setAnswer:(id:string,value:AnswerState)=>void
  removeAnswer:(id:string)=>void
  toggleClinicalDiagnosis:(id:string)=>void
  clearClinicalDiagnoses:()=>void
  addPainReport:()=>void
  updatePainReport:(id:string,patch:Partial<ClinicalPainReport>)=>void
  removePainReport:(id:string)=>void
  clearPainReports:()=>void
  clear:()=>void
  loadSnapshot:(answers:Record<string,AnswerState>,diagnosisIds?:string[])=>void
  responseRevision:number
  clinical:ReturnType<typeof computeClinicalState>
}

const ClinicalContext = createContext<Ctx|null>(null)

export function ClinicalProvider({children}:{children:ReactNode}){
  const [selected,setSelected] = useState<Record<string,AnswerState>>({})
  const [clinicalDiagnosisIds,setClinicalDiagnosisIds] = useState<string[]>([])
  const [painReports,setPainReports] = useState<ClinicalPainReport[]>([])
  const [responseRevision,setResponseRevision] = useState(0)
  const clinical = useMemo(()=>computeClinicalState(selected),[selected])
  return <ClinicalContext.Provider value={{
    selected,
    clinicalDiagnosisIds,
    painReports,
    setAnswer:(id,value)=>{setSelected(s=>({...s,[id]:value}));setResponseRevision(r=>r+1)},
    removeAnswer:(id)=>{setSelected(s=>{const next={...s};delete next[id];return next});setResponseRevision(r=>r+1)},
    toggleClinicalDiagnosis:(id)=>{setClinicalDiagnosisIds(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);setResponseRevision(r=>r+1)},
    clearClinicalDiagnoses:()=>{setClinicalDiagnosisIds([]);setResponseRevision(r=>r+1)},
    addPainReport:()=>setPainReports(x=>[...x,{id:crypto.randomUUID(),location:'',intensity:5}]),
    updatePainReport:(id,patch)=>setPainReports(x=>x.map(p=>p.id===id?{...p,...patch}:p)),
    removePainReport:(id)=>setPainReports(x=>x.filter(p=>p.id!==id)),
    clearPainReports:()=>setPainReports([]),
    clear:()=>{setSelected({});setClinicalDiagnosisIds([]);setPainReports([]);setResponseRevision(r=>r+1)},
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
