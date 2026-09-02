import type { AnswerState } from './types'

export type SafetyLevel='clear'|'caution'|'urgent'

export interface SafetyState{
  level:SafetyLevel
  canContinue:boolean
  triggers:string[]
  message:string|null
}

const yes=(a:Record<string,AnswerState>,id:string)=>a[id]==='yes'

export const SAFETY_ONLY_SYMPTOM_IDS = new Set<string>([
  'severe_chest_pain',
  'severe_breathlessness',
  'new_neuro_deficit',
  'black_bloody_stool',
  'syncope',
  'severe_sudden_headache',
  'fever_severe_abdominal_pain',
  'saddle_anesthesia_bladder',
  'unexplained_weight_loss',
  'persistent_fever',
  'progressive_weakness',
  'persistent_vomiting'
])

export function stripSafetyOnlyAnswers(a:Record<string,AnswerState>){
  const out:Record<string,AnswerState>={}
  for(const [id,value] of Object.entries(a)){
    if(!SAFETY_ONLY_SYMPTOM_IDS.has(id))out[id]=value
  }
  return out
}


export function computeSafety(a:Record<string,AnswerState>):SafetyState{
  const urgent:string[]=[]
  const caution:string[]=[]

  if(
    yes(a,'severe_chest_pain') ||
    yes(a,'chest_pain_radiates_arm') ||
    (yes(a,'chest_pain') && yes(a,'cold_sweat')) ||
    (yes(a,'pain_radiates_shoulder') && (yes(a,'short_breath')||yes(a,'cold_sweat')))
  ) urgent.push('Dor no peito com características de alerta')
  if(yes(a,'severe_breathlessness')) urgent.push('Falta de ar intensa ou em piora')
  if(yes(a,'new_neuro_deficit') || yes(a,'facial_weakness')) urgent.push('Fraqueza, alteração da fala ou outro déficit neurológico novo')
  if(yes(a,'black_bloody_stool')) urgent.push('Sangue importante ou fezes negras')
  if(yes(a,'syncope')) urgent.push('Desmaio')
  if(yes(a,'severe_sudden_headache')) urgent.push('Cefaleia súbita e muito intensa')
  if(yes(a,'fever_severe_abdominal_pain')) urgent.push('Febre com dor abdominal importante')
  if(yes(a,'saddle_anesthesia_bladder')) urgent.push('Alteração urinária/intestinal nova com dormência em região íntima')

  if(yes(a,'unexplained_weight_loss')) caution.push('Perda de peso sem explicação')
  if(yes(a,'persistent_fever')) caution.push('Febre persistente')
  if(yes(a,'progressive_weakness')) caution.push('Fraqueza progressiva')
  if(yes(a,'persistent_vomiting')) caution.push('Vômitos persistentes')

  if(urgent.length)return{
    level:'urgent',canContinue:false,triggers:urgent,
    message:'Estas respostas podem indicar uma situação que precisa de avaliação médica rápida. O mapa tradicional foi interrompido por segurança.'
  }
  if(caution.length)return{
    level:'caution',canContinue:true,triggers:caution,
    message:'Antes de interpretar este mapa isoladamente, vale discutir estes sinais com um profissional de saúde.'
  }
  return{level:'clear',canContinue:true,triggers:[],message:null}
}
