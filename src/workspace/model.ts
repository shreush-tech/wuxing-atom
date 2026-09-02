import type {PatientRecord,SessionRecord,WorkspaceRole,WorkspaceState} from './types'
import {parseAcupointList} from './acupointCodes'

export const workspaceInitialState:WorkspaceState={
  role:'patient',
  activePatientId:null,
  viewSessionId:null,
  patients:[],
  sessions:[],
  railOpen:false
}

export function createPatient(displayName:string):PatientRecord{
  const clean=displayName.trim().replace(/\s+/g,' ')
  if(!clean)throw new Error('Nome do paciente é obrigatório')
  const now=new Date().toISOString()
  return {
    id:crypto.randomUUID(),
    displayName:clean,
    status:'active',
    tags:[],
    createdAt:now,
    updatedAt:now,
    sessionCount:0
  }
}

export function patientSessions(sessions:SessionRecord[],patientId:string){
  return sessions
    .filter(s=>s.patientId===patientId)
    .sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))
}

export function appendSession(
  state:WorkspaceState,
  session:SessionRecord
):WorkspaceState{
  const patient=state.patients.find(p=>p.id===session.patientId)
  if(!patient)throw new Error('Paciente não encontrado')
  const exists=state.sessions.some(s=>s.id===session.id)
  if(exists)throw new Error('Sessão duplicada')
  const prior=state.sessions.filter(s=>s.patientId===session.patientId)
  if(prior.some(s=>s.number===session.number))throw new Error('Número de sessão duplicado')
  const expected=prior.reduce((m,s)=>Math.max(m,s.number),0)+1
  if(session.number!==expected)throw new Error(`Sequência de sessão inválida: esperado ${expected}`)
  const updatedPatient={
    ...patient,
    sessionCount:patient.sessionCount+1,
    lastSessionAt:session.occurredAt,
    updatedAt:new Date().toISOString()
  }
  return {
    ...state,
    patients:state.patients.map(p=>p.id===patient.id?updatedPatient:p),
    sessions:[...state.sessions,session]
  }
}

export function latestSession(sessions:SessionRecord[],patientId:string){
  const all=patientSessions(sessions,patientId)
  return all.length?all[all.length-1]:null
}

export function setWorkspaceRole(state:WorkspaceState,role:WorkspaceRole):WorkspaceState{
  if(role==='patient'){
    return {...state,role,activePatientId:null,viewSessionId:null,railOpen:false}
  }
  return {...state,role}
}

export function normalizePointCodes(codes:string[]){
  return parseAcupointList(codes.join(',')).points.map(x=>x.canonical)
}

export function symptomTrajectory(sessions:SessionRecord[],patientId:string){
  return patientSessions(sessions,patientId)
    .filter(s=>typeof s.symptomBurden==='number')
    .map(s=>({session:s.number,date:s.occurredAt,value:s.symptomBurden as number}))
}

export function elementTrajectory(sessions:SessionRecord[],patientId:string,element:'wood'|'fire'|'earth'|'metal'|'water'){
  return patientSessions(sessions,patientId).map(s=>({
    session:s.number,
    date:s.occurredAt,
    activity:s.elements[element].activity,
    deficiency:s.elements[element].deficiency,
    excess:s.elements[element].excess
  }))
}

export function painTrajectory(sessions:SessionRecord[],patientId:string){
  return patientSessions(sessions,patientId)
    .flatMap(s=>(s.pains||[]).map(p=>({
      session:s.number,date:s.occurredAt,painId:p.id,location:p.location,intensity:p.intensity
    })))
}

export function painLocations(sessions:SessionRecord[],patientId:string){
  const map=new Map<string,{location:string,values:Array<{session:number,date:string,intensity:number}>}>()
  for(const row of painTrajectory(sessions,patientId)){
    const key=row.location.trim().toLocaleLowerCase('pt-BR')
    const current=map.get(key)||{location:row.location,values:[]}
    current.values.push({session:row.session,date:row.date,intensity:row.intensity})
    map.set(key,current)
  }
  return [...map.values()]
}

export const elementIds=['wood','fire','earth','metal','water'] as const

export function elementSeries(sessions:SessionRecord[],patientId:string){
  const all=patientSessions(sessions,patientId)
  return elementIds.map(element=>({
    element,
    values:all.map(s=>({
      session:s.number,
      date:s.occurredAt,
      value:s.elements[element].activity
    }))
  }))
}

export function patternTrajectory(sessions:SessionRecord[],patientId:string){
  const all=patientSessions(sessions,patientId)
  const ids=new Set(all.flatMap(s=>s.patterns.map(p=>p.id)))
  return [...ids].map(id=>({
    id,
    label:all.flatMap(s=>s.patterns).find(p=>p.id===id)?.label||id,
    values:all.map(s=>({
      session:s.number,
      date:s.occurredAt,
      confidence:s.patterns.find(p=>p.id===id)?.confidence||0,
      raw:s.patterns.find(p=>p.id===id)?.raw||0
    }))
  })).sort((a,b)=>{
    const av=a.values.at(-1)?.confidence||0
    const bv=b.values.at(-1)?.confidence||0
    return bv-av
  })
}

export function patientLongitudinalSummary(sessions:SessionRecord[],patientId:string){
  const all=patientSessions(sessions,patientId)
  const pain=painLocations(sessions,patientId)
  const first=all[0]||null
  const last=all.at(-1)||null
  return {
    sessionCount:all.length,
    firstDate:first?.occurredAt||null,
    lastDate:last?.occurredAt||null,
    painSites:pain.length,
    latestPain:pain.map(p=>({location:p.location,intensity:p.values.at(-1)?.intensity??null})),
    latestPatterns:last?.patterns.slice(0,3)||[],
    latestElements:last?elementIds.map(element=>({element,activity:last.elements[element].activity})):[]
  }
}
