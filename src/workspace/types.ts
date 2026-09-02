import type {AnswerState,ElementId,PatternId} from '../clinical/types'

export type WorkspaceRole='physician'|'student'|'patient'
export type PatientStatus='active'|'paused'|'archived'

export type ElementSnapshot=Record<ElementId,{
  activity:number
  deficiency:number
  excess:number
  heat:number
  cold:number
  stagnation:number
}>

export type PatternSnapshot={
  id:PatternId
  label:string
  raw:number
  confidence:number
}

export type PainEntry={
  id:string
  location:string
  intensity:number // 0–10 reported for this session
}

export type TreatmentPointEntry={
  id:string
  code:string // canonical internal code, e.g. LV3
  displayCode:string // localized display, e.g. F3
  originalInput?:string
  note?:string
  source:'clinician'|'recommended'
}

export type SessionRecord={
  id:string
  patientId:string
  number:number
  occurredAt:string
  answers:Record<string,AnswerState>
  clinicalDiagnosisIds:string[]
  patterns:PatternSnapshot[]
  elements:ElementSnapshot
  usedPoints:TreatmentPointEntry[]
  recommendedPointCodes:string[]
  clinicianNote:string
  patientNote?:string
  symptomBurden?:number
  painPresent?:boolean
  pains?:PainEntry[]
  createdAt:string
  updatedAt:string
  engineVersion:string
  knowledgeVersion:string
  schemaVersion:2
}

export type PatientRecord={
  id:string
  displayName:string
  preferredName?:string
  status:PatientStatus
  tags:string[]
  createdAt:string
  updatedAt:string
  lastSessionAt?:string
  sessionCount:number
}

export type WorkspaceState={
  role:WorkspaceRole
  activePatientId:string|null
  viewSessionId:string|null
  patients:PatientRecord[]
  sessions:SessionRecord[]
  railOpen:boolean
}

export type DraftSession={
  clinicianNote:string
  usedPointCodes:string[]
  symptomBurden?:number
  painPresent?:boolean
  pains?:PainEntry[]
}

export const emptyDraftSession:DraftSession={
  clinicianNote:'',
  usedPointCodes:[],
  painPresent:false,
  pains:[]
}
