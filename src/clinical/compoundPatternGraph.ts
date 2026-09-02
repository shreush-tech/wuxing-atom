import type {AnswerState,CompoundDiagnosis,ElementId,PatternId,SymptomId} from './types'
import type {PatternScore} from './types'

type Rule={
  id:string
  label:string
  systems:ElementId[]
  components:PatternId[]
  requiredAny?:SymptomId[]
  signature?:SymptomId[]
  minComponentRaw?:number
}

export const compoundPatternRules:Rule[]=[
  {id:'heart_spleen_qi_combo',label:'Deficiência de Qi do Coração e Baço',systems:['fire','earth'],components:['heart_qi','spleen_qi'],signature:['palpitations','fatigue','poor_appetite','loose_stools','poor_sleep']},
  {id:'heart_spleen_blood_combo',label:'Deficiência de Sangue/Qi do Coração e Baço',systems:['fire','earth'],components:['heart_blood','spleen_qi'],signature:['palpitations','poor_memory','poor_appetite','fatigue','poor_sleep']},
  {id:'heart_kidney_disharmony_combo',label:'Desarmonia Coração–Rim',systems:['fire','water'],components:['heart_yin','kidney_yin'],signature:['poor_sleep','palpitations','night_sweats','low_back','tinnitus']},
  {id:'heart_gallbladder_qi_combo',label:'Deficiência de Qi do Coração e Vesícula Biliar',systems:['fire','wood'],components:['heart_qi'],signature:['palpitations','dizziness','nightmares','fearful','plum_pit']},
  {id:'heart_lung_qi_combo',label:'Deficiência de Qi do Coração e Pulmão',systems:['fire','metal'],components:['heart_qi','lung_qi'],signature:['short_breath','palpitations','fatigue','day_sweats','catches_colds']},
  {id:'heart_lung_yin_combo',label:'Deficiência de Yin do Coração e Pulmão',systems:['fire','metal'],components:['heart_yin','lung_yin'],signature:['poor_sleep','red_cheeks','short_breath','five_center_heat']},
  {id:'lung_spleen_qi_combo',label:'Deficiência de Qi do Pulmão e Baço',systems:['metal','earth'],components:['lung_qi','spleen_qi'],signature:['short_breath','fatigue','loose_stools','poor_appetite','day_sweats']},

  {id:'spleen_kidney_yang_combo',label:'Deficiência de Yang do Baço e Rim',systems:['earth','water'],components:['spleen_yang','kidney_yang'],signature:['cold_body','fatigue','loose_stools','low_back','edema']},
  {id:'liver_kidney_yin_combo',label:'Deficiência de Yin do Fígado e Rim',systems:['wood','water'],components:['liver_yin','kidney_yin'],signature:['dizziness','blurred_vision','low_back','night_sweats','dry_mouth']},
  {id:'liver_blood_kidney_yin_combo',label:'Deficiência de Sangue do Fígado e Yin do Rim',systems:['wood','water'],components:['liver_blood','kidney_yin'],signature:['dizziness','poor_memory','low_back','night_sweats','pale_face']},
  {id:'kidney_heart_liver_yin_combo',label:'Deficiência de Yin do Rim, Coração e Fígado',systems:['water','fire','wood'],components:['kidney_yin','heart_yin','liver_yin'],signature:['poor_sleep','palpitations','dizziness','tinnitus','low_back','night_sweats','dry_mouth']},

  {id:'liver_overacts_spleen_combo',label:'Fígado sobreagindo ao Baço',systems:['wood','earth'],components:['liver_stagnation','spleen_qi'],signature:['stress_bowel','rib_pain','poor_appetite','loose_stools','bloating']},
  {id:'liver_insults_lung_combo',label:'Fígado insultando o Pulmão',systems:['wood','metal'],components:['liver_stagnation','lung_qi'],signature:['irritable','rib_pain','sighing','short_breath']},

  {id:'liver_qi_blood_def_combo',label:'Estagnação do Qi do Fígado com Deficiência de Sangue',systems:['wood'],components:['liver_stagnation','liver_blood'],signature:['irritable','rib_pain','dizziness','headache','poor_memory']},
  {id:'liver_qi_fire_combo',label:'Estagnação do Qi do Fígado transformando-se em Fogo',systems:['wood'],components:['liver_stagnation','liver_fire'],signature:['irritable','bitter_taste','rib_pain','headache','constipation']},
  {id:'liver_qi_blood_heat_combo',label:'Estagnação do Qi do Fígado com Calor no Sangue',systems:['wood'],components:['liver_stagnation','liver_fire'],signature:['irritable','bitter_taste','dry_mouth','poor_sleep','pms']},
  {id:'liver_qi_phlegm_fire_combo',label:'Estagnação do Qi do Fígado com Fleuma-Fogo',systems:['wood','earth'],components:['liver_stagnation','stomach_phlegm_fire'],signature:['bitter_taste','rib_pain','poor_sleep','dizziness','yellow_phlegm']},

  {id:'phlegm_liver_qi_combo',label:'Fleuma com Estagnação do Qi do Fígado',systems:['earth','wood'],components:['liver_stagnation'],signature:['dizziness','nausea','rib_pain','plum_pit','phlegm']},
  {id:'phlegm_fire_heart_combo',label:'Fleuma-Fogo perturbando o Coração',systems:['earth','fire'],components:['heart_phlegm_fire'],signature:['anxiety','palpitations','dizziness','poor_sleep','bitter_taste','mental_confusion']},

  {id:'qi_blood_deficiency_combo',label:'Deficiência de Qi e Sangue',systems:['earth','fire'],components:['spleen_qi','heart_blood'],signature:['fatigue','short_breath','pale_face','day_sweats']},
  {id:'qi_blood_stagnation_combo',label:'Estagnação de Qi e Sangue',systems:['wood','fire'],components:['liver_stagnation','heart_blood_stasis'],signature:['rib_pain','pms','pain_fixed','dark_face']},
  {id:'blood_stasis_heat_combo',label:'Estase de Sangue com Calor',systems:['fire'],components:['heart_blood_stasis'],signature:['chest_pain','pain_worse_night','hot_chest','varicose_veins']},

  {id:'qi_yin_def_liver_yang_combo',label:'Deficiência de Qi e Yin com Ascensão do Yang do Fígado',systems:['earth','water','wood'],components:['liver_yang_rising','kidney_yin'],signature:['fatigue','low_back','dizziness','tinnitus','poor_sleep','night_sweats','headache']},
  {id:'spleen_kidney_yang_liver_qi_combo',label:'Deficiência de Yang do Baço e Rim com Estagnação do Qi do Fígado',systems:['earth','water','wood'],components:['spleen_yang','kidney_yang','liver_stagnation'],signature:['fatigue','loose_stools','low_back','low_libido','cold_feet','bloating']},
]

const yes=(s:Record<string,AnswerState>,id:string)=>s[id]==='yes'

export function computeCompoundDiagnoses(
  selected:Record<string,AnswerState>,
  patternScores:PatternScore[]
):CompoundDiagnosis[]{
  const scoreMap=new Map(patternScores.map(p=>[p.id,p]))
  const out:CompoundDiagnosis[]=[]

  for(const r of compoundPatternRules){
    const componentScores=r.components.map(id=>scoreMap.get(id)?.raw||0)
    const componentSupport=componentScores.filter(x=>x>=2.5).length
    const signature=(r.signature||[]).filter(id=>yes(selected,id))
    const requiredOk=!r.requiredAny?.length || r.requiredAny.some(id=>yes(selected,id))

    if(!requiredOk)continue
    if(componentSupport===0 && signature.length<3)continue

    // Book tables define the clusters; this score is product modeling, not a book probability.
    const raw=componentScores.reduce((a,b)=>a+Math.max(0,b),0)*.38 + signature.length*1.2
    const minimumSignature=r.systems.length>=3?4:3
    if(signature.length<minimumSignature && componentSupport<Math.min(2,r.components.length))continue

    out.push({
      id:r.id,
      label:r.label,
      systems:r.systems,
      components:r.components,
      raw,
      confidence:Math.max(0,Math.min(1,raw/10)),
      evidence:signature,
      source:'uploaded_reference_book'
    })
  }

  return out.sort((a,b)=>b.raw-a.raw)
}
