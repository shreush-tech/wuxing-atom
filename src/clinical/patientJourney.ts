export type JourneyStage='symptoms'|'clinical_diagnoses'|'refining'|'map'|'balance'

export type PatientJourney={
  stage:JourneyStage
  symptomCount:number
  clinicalDiagnosisIds:string[]
  sufficientForFirstReading:boolean
}

export const initialPatientJourney:PatientJourney={
  stage:'symptoms',symptomCount:0,clinicalDiagnosisIds:[],sufficientForFirstReading:false
}

export function nextJourneyStage(j:PatientJourney):JourneyStage{
  if(j.symptomCount===0)return 'symptoms'
  if(j.stage==='symptoms')return 'clinical_diagnoses'
  if(!j.sufficientForFirstReading)return 'refining'
  if(j.stage==='refining'||j.stage==='clinical_diagnoses')return 'map'
  return 'balance'
}

export const journeyPolicy={
  symptomsLead:true,
  clinicalDiagnosesAreOptionalContext:true,
  clinicalDiagnosesNeverCreateImbalance:true,
  mapRequiresCurrentSymptomEvidence:true,
  patientNarrative:['Entender seus sintomas','Considerar seus diagnósticos clínicos','Identificar seus desequilíbrios','Visualizar seu mapa','Buscar o equilíbrio']
} as const
