import type {WorkspaceState,SessionRecord,PatientRecord} from './types'
import {workspaceInitialState} from './model'
import {parseAcupointCode} from './acupointCodes'

const roles=new Set(['physician','student','patient'])
const statuses=new Set(['active','paused','archived'])

function safePatient(x:any):PatientRecord|null{
  if(!x||typeof x!=='object'||typeof x.id!=='string'||typeof x.displayName!=='string')return null
  const displayName=x.displayName.trim().replace(/\s+/g,' ')
  if(!displayName)return null
  return {
    id:x.id,
    displayName,
    preferredName:typeof x.preferredName==='string'?x.preferredName:undefined,
    status:statuses.has(x.status)?x.status:'active',
    tags:Array.isArray(x.tags)?x.tags.filter((v:any)=>typeof v==='string').slice(0,50):[],
    createdAt:typeof x.createdAt==='string'?x.createdAt:new Date().toISOString(),
    updatedAt:typeof x.updatedAt==='string'?x.updatedAt:new Date().toISOString(),
    lastSessionAt:typeof x.lastSessionAt==='string'?x.lastSessionAt:undefined,
    sessionCount:Number.isInteger(x.sessionCount)&&x.sessionCount>=0?x.sessionCount:0
  }
}

function metric(v:any){
  const n=Number(v)
  return Number.isFinite(n)?Math.max(0,Math.min(1,n)):0
}

function safeElements(x:any){
  const ids=['wood','fire','earth','metal','water'] as const
  const out:any={}
  for(const id of ids){
    const e=x?.[id]||{}
    out[id]={
      activity:metric(e.activity),
      deficiency:metric(e.deficiency),
      excess:metric(e.excess),
      heat:metric(e.heat),
      cold:metric(e.cold),
      stagnation:metric(e.stagnation)
    }
  }
  return out
}

function safeUsedPoints(items:any){
  if(!Array.isArray(items))return []
  return items.flatMap((x:any,i:number)=>{
    const parsed=parseAcupointCode(String(x?.code||x?.displayCode||x?.originalInput||''))
    if(!parsed)return []
    return [{
      id:typeof x?.id==='string'?x.id:`legacy-point-${i}`,
      code:parsed.canonical,
      displayCode:parsed.displayPtBr,
      originalInput:typeof x?.originalInput==='string'?x.originalInput:undefined,
      note:typeof x?.note==='string'?x.note:undefined,
      source:x?.source==='recommended'?'recommended':'clinician'
    }]
  })
}

function safeSession(x:any,patientIds:Set<string>):SessionRecord|null{
  if(!x||typeof x!=='object'||typeof x.id!=='string'||typeof x.patientId!=='string')return null
  if(!patientIds.has(x.patientId))return null
  if(!Number.isInteger(x.number)||x.number<1)return null
  if(!x.elements||typeof x.elements!=='object')return null
  return {
    ...x,
    elements:safeElements(x.elements),
    answers:x.answers&&typeof x.answers==='object'?x.answers:{},
    clinicalDiagnosisIds:Array.isArray(x.clinicalDiagnosisIds)?x.clinicalDiagnosisIds.filter((v:any)=>typeof v==='string'):[],
    patterns:Array.isArray(x.patterns)?x.patterns:[],
    usedPoints:safeUsedPoints(x.usedPoints),
    recommendedPointCodes:Array.isArray(x.recommendedPointCodes)?x.recommendedPointCodes:[],
    clinicianNote:typeof x.clinicianNote==='string'?x.clinicianNote:'',
    createdAt:typeof x.createdAt==='string'?x.createdAt:new Date().toISOString(),
    updatedAt:typeof x.updatedAt==='string'?x.updatedAt:new Date().toISOString(),
    engineVersion:typeof x.engineVersion==='string'?x.engineVersion:'legacy',
    knowledgeVersion:typeof x.knowledgeVersion==='string'?x.knowledgeVersion:'legacy',
    schemaVersion:2
  } as SessionRecord
}

export function sanitizeWorkspace(input:any):WorkspaceState{
  if(!input||typeof input!=='object')return structuredClone(workspaceInitialState)
  const patients=(Array.isArray(input.patients)?input.patients:[])
    .map(safePatient).filter(Boolean) as PatientRecord[]
  const uniquePatients=[...new Map(patients.map(p=>[p.id,p])).values()]
  const patientIds=new Set(uniquePatients.map(p=>p.id))

  const sessions=(Array.isArray(input.sessions)?input.sessions:[])
    .map((x:any)=>safeSession(x,patientIds)).filter(Boolean) as SessionRecord[]
  const uniqueSessions=[...new Map(sessions.map(s=>[s.id,s])).values()]
    .sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))

  const countByPatient=new Map<string,number>()
  const lastByPatient=new Map<string,string>()
  for(const s of uniqueSessions){
    countByPatient.set(s.patientId,(countByPatient.get(s.patientId)||0)+1)
    const prev=lastByPatient.get(s.patientId)
    if(!prev||s.occurredAt>prev)lastByPatient.set(s.patientId,s.occurredAt)
  }

  const normalizedPatients=uniquePatients.map(p=>({
    ...p,
    sessionCount:countByPatient.get(p.id)||0,
    lastSessionAt:lastByPatient.get(p.id)
  }))

  const activePatientId=typeof input.activePatientId==='string'&&patientIds.has(input.activePatientId)
    ?input.activePatientId:null
  const role=roles.has(input.role)?input.role:'patient'
  const sessionIds=new Set(uniqueSessions.map(s=>s.id))
  const requestedView=typeof input.viewSessionId==='string'&&sessionIds.has(input.viewSessionId)
    ?input.viewSessionId:null
  const viewSessionId=requestedView && uniqueSessions.some(s=>s.id===requestedView&&s.patientId===activePatientId)
    ?requestedView:null

  return {
    role:role as WorkspaceState['role'],
    activePatientId:role==='patient'?null:activePatientId,
    viewSessionId:role==='patient'?null:viewSessionId,
    patients:normalizedPatients,
    sessions:uniqueSessions,
    railOpen:role==='patient'?false:!!input.railOpen
  }
}
