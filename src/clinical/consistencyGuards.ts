import type {AnswerState} from './types'
import {computeSafety} from './safetyGate'

export type GuardResult={
  id:string
  ok:boolean
  note:string
}

function yes(selected:Record<string,AnswerState>, id:string){
  return selected[id]==='yes'
}

export function runConsistencyGuards(selected:Record<string,AnswerState>):GuardResult[]{
  const out:GuardResult[]=[]

  // Mouth ulcers alone must not force Heart Fire: Stomach Phlegm-Fire remains viable
  const mouthUlcer=yes(selected,'mouth_ulcers')
  // Do not count the tested sign itself; otherwise an isolated mouth ulcer
  // incorrectly satisfies its own context requirement.
  const heartCluster=['palpitations','poor_sleep','anxiety','marked_agitation'].filter(x=>yes(selected,x)).length
  const stomachCluster=['constant_hunger','bleeding_gums','bad_breath','acid_reflux'].filter(x=>yes(selected,x)).length
  out.push({
    id:'mouth_ulcer_not_exclusive',
    ok:!mouthUlcer || heartCluster>0 || stomachCluster>0,
    note:'Afta isolada não deve ser tratada como exclusiva de Coração.'
  })

  // Bitter taste alone must not force Liver Fire.
  const bitter=yes(selected,'bitter_taste')
  const liverHeatCluster=['irritable','red_eyes','headache','rib_pain','poor_sleep'].filter(x=>yes(selected,x)).length
  out.push({
    id:'bitter_taste_not_exclusive',
    ok:!bitter || liverHeatCluster>0,
    note:'Gosto amargo é discriminativo, mas não pathognomônico.'
  })

  // Bleeding gums should strongly prefer Stomach Heat/Phlegm-Fire only when Earth/heat co-signs exist.
  const gums=yes(selected,'bleeding_gums')
  const earthHeat=['constant_hunger','cold_drinks','bad_breath','acid_reflux','constipation'].filter(x=>yes(selected,x)).length
  out.push({
    id:'bleeding_gums_context',
    ok:!gums || earthHeat>0,
    note:'Sangramento gengival precisa de co-sinais para evitar salto diagnóstico.'
  })

  // Insomnia is deliberately non-exclusive and should keep multiple systems alive.
  const insomnia=yes(selected,'poor_sleep')
  const insomniaContext=['palpitations','night_sweats','bitter_taste','dreams','anxiety','poor_memory'].filter(x=>yes(selected,x)).length
  out.push({
    id:'insomnia_multisystem',
    ok:!insomnia || insomniaContext>0,
    note:'Insônia isolada não deve encerrar o diferencial.'
  })

  // Chest-pain red flags must never be softened by TCM interpretation.
  const safety=computeSafety(selected)
  const urgentSelected=Object.entries(selected).some(([id,value])=>value==='yes' && [
    'severe_chest_pain','severe_breathlessness','new_neuro_deficit','black_bloody_stool','syncope',
    'severe_sudden_headache','fever_severe_abdominal_pain','saddle_anesthesia_bladder',
    'chest_pain_radiates_arm','cold_sweat','facial_weakness'
  ].includes(id))
  out.push({
    id:'safety_precedes_tcm',
    ok:!urgentSelected || !safety.canContinue,
    note:'Quando há um gatilho urgente, a camada de segurança deve interromper o resultado tradicional.'
  })

  return out
}
