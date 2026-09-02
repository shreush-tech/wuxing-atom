import {useMemo,useState} from 'react'
import {useClinical} from '../clinical/store'
import {patternLabel} from '../content/patternLabels'
import {useWorkspace} from './WorkspaceProvider'
import {patientSessions} from './model'
import {recommendedClinicianPoints} from './clinicianPointCore'
import {displayAcupointPtBr,parseAcupointList} from './acupointCodes'
import type {SessionRecord,TreatmentPointEntry,PainEntry} from './types'

function isoNow(){return new Date().toISOString()}
const ENGINE_VERSION='0.94.0'
const KNOWLEDGE_VERSION='book+acupro-0.85'

type PainDraft={id:string;location:string;intensity:number}
type Draft={note:string;points:string;burden:number|'';painPresent:boolean;pains:PainDraft[];open:boolean;error:string}
const emptyDraft=():Draft=>({note:'',points:'',burden:'',painPresent:false,pains:[],open:false,error:''})

export function SessionNotebook(){
  const {state,activePatient,addSession}=useWorkspace()
  const {selected,clinicalDiagnosisIds,clinical}=useClinical()
  const [drafts,setDrafts]=useState<Record<string,Draft>>({})
  const [savedPatient,setSavedPatient]=useState<string|null>(null)

  const patientId=activePatient?.id||''
  const draft=patientId?(drafts[patientId]||emptyDraft()):emptyDraft()
  const patchDraft=(patch:Partial<Draft>)=>{
    if(!patientId)return
    setDrafts(all=>({...all,[patientId]:{...(all[patientId]||emptyDraft()),...patch}}))
  }

  const addPain=()=>patchDraft({
    painPresent:true,
    pains:[...draft.pains,{id:crypto.randomUUID(),location:'',intensity:5}]
  })
  const patchPain=(id:string,patch:Partial<PainDraft>)=>patchDraft({
    pains:draft.pains.map(p=>p.id===id?{...p,...patch}:p)
  })
  const removePain=(id:string)=>{
    const pains=draft.pains.filter(p=>p.id!==id)
    patchDraft({pains,painPresent:pains.length>0})
  }

  const sessions=useMemo(
    ()=>patientId?patientSessions(state.sessions,patientId):[],
    [state.sessions,patientId]
  )
  const supportedForTreatment=useMemo(
    ()=>clinical.interview.canShowResult
      ? clinical.activePatterns.filter(p=>p.raw>0 && p.confidence>=0.35).slice(0,3)
      : [],
    [clinical.interview.canShowResult,clinical.activePatterns]
  )
  const recommended=useMemo(
    ()=>recommendedClinicianPoints(supportedForTreatment.map(p=>p.id)).slice(0,12),
    [supportedForTreatment]
  )

  if(state.role==='patient'||!activePatient)return null
  if(state.viewSessionId)return <section className="session-notebook historical-locked">
    <div className="session-summary-line"><span>Modo histórico</span><span>Volte ao mapa atual para registrar uma nova sessão.</span></div>
  </section>

  const save=()=>{
    patchDraft({error:''})
    const parsed=parseAcupointList(draft.points)
    if(parsed.invalid.length){
      patchDraft({error:`Revise ${parsed.invalid.length===1?'este código':'estes códigos'}: ${parsed.invalid.join(', ')}`})
      return
    }
    if(!Object.keys(selected).length && !draft.note.trim() && !parsed.points.length && !draft.painPresent){
      patchDraft({error:'A sessão está vazia. Registre sintomas, pontos utilizados ou uma nota clínica.'})
      return
    }

    const now=isoNow()
    const session:SessionRecord={
      id:crypto.randomUUID(),
      patientId:activePatient.id,
      number:sessions.length+1,
      occurredAt:now,
      answers:{...selected},
      clinicalDiagnosisIds:[...clinicalDiagnosisIds],
      patterns:clinical.activePatterns.slice(0,10).map(p=>({
        id:p.id,label:patternLabel(p.id),raw:p.raw,confidence:p.confidence
      })),
      elements:structuredClone(clinical.elements),
      usedPoints:parsed.points.map((point,i):TreatmentPointEntry=>({
        id:`${now}-${i}`,
        code:point.canonical,
        displayCode:point.displayPtBr,
        originalInput:point.input,
        source:'clinician'
      })),
      recommendedPointCodes:recommended.map(x=>x.code),
      clinicianNote:draft.note.trim(),
      symptomBurden:draft.burden===''?undefined:Math.max(0,Math.min(10,Number(draft.burden))),
      painPresent:draft.painPresent,
      pains:draft.painPresent?draft.pains.filter(p=>p.location.trim()).map((p):PainEntry=>({
        id:p.id,location:p.location.trim(),intensity:Math.max(0,Math.min(10,Number(p.intensity)))
      })):[],
      createdAt:now,
      updatedAt:now,
      engineVersion:ENGINE_VERSION,
      knowledgeVersion:KNOWLEDGE_VERSION,
      schemaVersion:2
    }

    try{
      addSession(session)
      setDrafts(all=>({...all,[patientId]:emptyDraft()}))
      setSavedPatient(patientId)
      window.setTimeout(()=>setSavedPatient(current=>current===patientId?null:current),1800)
    }catch(e){
      patchDraft({error:e instanceof Error?e.message:'Não foi possível registrar a sessão.'})
    }
  }

  return <section className={`session-notebook ${draft.open?'open':''}`}>
    <button className="session-notebook-trigger" onClick={()=>patchDraft({open:!draft.open})}>
      <span>{activePatient.displayName}</span>
      <strong>{sessions.length?`Sessão ${sessions.length+1}`:'Primeira sessão'}</strong>
      <i>{draft.open?'−':'+'}</i>
    </button>

    {draft.open&&<div className="session-notebook-body">
      <div className="session-summary-line">
        <span>{clinical.interview.canShowResult?'Mapa atual pronto para registrar':'O mapa ainda pode ser refinado'}</span>
        <span>{clinical.activePatterns[0]?patternLabel(clinical.activePatterns[0].id):'Sem desequilíbrio consolidado'}</span>
      </div>

      <div className="pain-assessment">
        <div className="pain-heading">
          <label className="pain-check">
            <input type="checkbox" checked={draft.painPresent} onChange={e=>{
              const on=e.target.checked
              patchDraft({painPresent:on,pains:on?(draft.pains.length?draft.pains:[{id:crypto.randomUUID(),location:'',intensity:5}]):[]})
            }}/>
            <span>Dor hoje</span>
          </label>
          {draft.painPresent&&<button type="button" className="add-pain" onClick={addPain}>+ outro local</button>}
        </div>
        {draft.painPresent&&<div className="pain-list">
          {draft.pains.map((pain,index)=><div className="pain-item" key={pain.id}>
            <div className="pain-location-row">
              <span>{draft.pains.length>1?`Dor ${index+1}`:'Local da dor'}</span>
              <input value={pain.location} onChange={e=>patchPain(pain.id,{location:e.target.value})} placeholder="Ex.: lombar, ombro direito, dedão do pé..."/>
              {draft.pains.length>1&&<button type="button" aria-label="Remover dor" onClick={()=>removePain(pain.id)}>×</button>}
            </div>
            <div className="pain-scale">
              <div><span>Intensidade hoje</span><b>{pain.intensity}/10</b></div>
              <input aria-label={`Intensidade da dor em ${pain.location||'local não informado'}`} type="range" min="0" max="10" step="1" value={pain.intensity} onChange={e=>patchPain(pain.id,{intensity:Number(e.target.value)})}/>
              <div className="pain-ticks"><span>0</span><span>5</span><span>10</span></div>
            </div>
          </div>)}
        </div>}
      </div>

      <label>
        <span>Intensidade global dos sintomas</span>
        <div className="burden-row">
          <input type="range" min="0" max="10" step="1" value={draft.burden===''?5:draft.burden} onChange={e=>patchDraft({burden:Number(e.target.value)})}/>
          <b>{draft.burden===''?'—':draft.burden}/10</b>
        </div>
      </label>

      <label>
        <span>Pontos utilizados nesta sessão</span>
        <input value={draft.points} onChange={e=>patchDraft({points:e.target.value})} placeholder="Ex.: F3, IG4, E36, BP6"/>
        {!!recommended.length&&<small>
          Pontos-base do mapa com suporte suficiente: {recommended.map(x=>displayAcupointPtBr(x.code)).join(' · ')}
        </small>}
      </label>

      <label>
        <span>Notas da sessão</span>
        <textarea value={draft.note} onChange={e=>patchDraft({note:e.target.value})} placeholder="Evolução, resposta ao tratamento, observações clínicas..."/>
      </label>

      {draft.error&&<div className="session-error" role="alert">{draft.error}</div>}
      <button className="save-session" onClick={save}>Registrar sessão</button>
    </div>}

    {savedPatient===patientId&&<div className="session-saved">Sessão registrada</div>}
  </section>
}
