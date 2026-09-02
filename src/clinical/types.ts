export type ElementId = 'wood'|'fire'|'earth'|'metal'|'water'

export type PatternId =
  | 'spleen_qi' | 'spleen_yang' | 'spleen_yin' | 'spleen_blood'
  | 'spleen_qi_sinking' | 'spleen_not_holding_blood' | 'spleen_qi_damp'
  | 'cold_damp_spleen'
  | 'stomach_qi' | 'stomach_yang' | 'stomach_yin' | 'stomach_fire'
  | 'stomach_phlegm_fire' | 'food_stagnation' | 'stomach_blood_stasis'
  | 'cold_invades_stomach'
  | 'liver_stagnation' | 'liver_yang_rising' | 'liver_fire'
  | 'liver_blood' | 'liver_yin' | 'liver_damp_heat' | 'liver_spleen'
  | 'liver_insulting_lung' | 'liver_yang_wind'
  | 'heart_qi' | 'heart_blood' | 'heart_yin' | 'heart_yang'
  | 'heart_fire' | 'heart_phlegm_fire' | 'heart_blood_stasis'
  | 'heart_yin_liver_qi'
  | 'lung_qi' | 'lung_yin' | 'lung_heat' | 'lung_dryness'
  | 'lung_wind_cold' | 'lung_wind_heat' | 'lung_wind_damp'
  | 'lung_phlegm_cold' | 'lung_phlegm_heat' | 'lung_phlegm_fluid'
  | 'large_intestine_heat' | 'large_intestine_cold'
  | 'large_intestine_damp_heat' | 'large_intestine_dryness'
  | 'kidney_qi' | 'kidney_yang' | 'kidney_yin' | 'kidney_essence'
  | 'kidney_yin_fire' | 'kidney_qi_not_firm' | 'kidney_receive_lung'
  | 'kidney_water_lung'
  | 'heart_kidney_disharmony' | 'spleen_kidney_yang'
  | 'liver_kidney_yin' | 'kidney_yin_yang'
  | 'heart_spleen_qi' | 'heart_spleen_blood_qi'


export type AnswerState = 'yes'|'no'|'unknown'
export type SymptomId = string

export interface Symptom {
  id: SymptomId
  label: string
  aliases?: string[]
  category: string
  weights?: Partial<Record<PatternId, number>>
  contradicts?: Partial<Record<PatternId, number>>
}

export interface PatternDefinition {
  id: PatternId
  label: string
  element: ElementId
  nature: {
    deficiency?: number
    excess?: number
    heat?: number
    cold?: number
    stagnation?: number
  }
}

export interface EvidenceItem {
  symptomId: SymptomId
  contribution: number
  kind: 'support'|'contradiction'
}

export interface PatternScore {
  id: PatternId
  raw: number
  confidence: number
  evidence: EvidenceItem[]
}

export interface ElementVisualState {
  activity: number
  deficiency: number
  excess: number
  heat: number
  cold: number
  stagnation: number
}

export interface RelationshipState {
  id: string
  source: ElementId
  target: ElementId
  type: 'generation'|'control'|'overacting'|'countercontrol'|'functional'
  strength: number
  confidence: number
  label: string
  title: string
  explanation: string
  evidence: string[]
}

export type MapReadiness = 'starting'|'forming'|'refine'|'ready'|'ambiguous'
export type ReadingReadiness = 'insufficient'|'initial'|'refinable'|'well_supported'

export interface InterviewState {
  answeredCount: number
  yesCount: number
  informationLevel: number
  readiness: MapReadiness
  readingReadiness: ReadingReadiness
  leadingPatternId: PatternId|null
  runnerUpPatternId: PatternId|null
  separation: number
  nextBestQuestions: SymptomId[]
  canShowResult: boolean
  rationale: string
}

export interface SystemDiagnosis {
  element: ElementId
  patterns: PatternScore[]
}


export interface CompoundDiagnosis {
  id: string
  label: string
  systems: ElementId[]
  components: PatternId[]
  raw: number
  confidence: number
  evidence: SymptomId[]
  source: 'uploaded_reference_book'
}

export interface ClinicalState {
  selected: Record<string, AnswerState>
  patternRelationships: Array<{
    id:string
    a:PatternId
    b:PatternId
    kind:'coexisting'|'root_branch'|'differential'
    title:string
    explanation:string
    discriminators:SymptomId[]
    scoreGap:number
    bothSupported:boolean
  }>
  /** @deprecated v0.90 compatibility alias */
  diagnosticTensions: Array<{
    id:string
    a:PatternId
    b:PatternId
    kind:'coexisting'|'root_branch'|'differential'
    title:string
    explanation:string
    discriminators:SymptomId[]
    scoreGap:number
    bothSupported:boolean
  }>
  patterns: PatternScore[]
  systemDiagnoses: SystemDiagnosis[]
  activePatterns: PatternScore[]
  compoundDiagnoses: CompoundDiagnosis[]
  contextualDiagnoses: Array<{id:string;label:string;family:string;raw:number;evidence:string[]}>
  elements: Record<ElementId, ElementVisualState>
  relationship: RelationshipState | null
  interview: InterviewState
}
