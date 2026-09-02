import type {AnswerState} from './types'

const rules:Record<string,string[]>={
  constipation:['constipation','hard_dry_stool'],
  headache:['headache'],
  tinnitus:['tinnitus'],
  menstrual:['pms'],
  amenorrhea:['amenorrhea'],
  scanty_menses:['scanty_menses'],
  mood:['anxiety','irritable','poor_sleep'],
  depression:['depressed'],
  menopause:['hot_flash'],
  digestive:['bloating','nausea','poor_appetite'],
  respiratory:['phlegm','yellow_phlegm','short_breath'],
  neurological:['dizziness','tremor','numbness'],
  facial_pain:['facial_pain'],
  chronic_pain:['pain_fixed','pain_worse_night'],
  throat:['plum_pit'],
  fatigue:['fatigue'],
  joint_pain:['joint_pain','joint_swelling','joint_red'],
  gout:['joint_red','big_toe_pain'],
  facial_paralysis:['facial_weakness'],
  cognitive:['poor_memory','mental_confusion'],
  tremor:['tremor'],
  parkinsonian:['tremor','muscle_stiffness','slow_movement'],
  chest_pain:['chest_pain','chest_fullness'],
  stroke:['sudden_onset','facial_weakness','weak_limbs'],
  anxiety:['anxiety','palpitations','sighing'],
  urinary:['burning_urine','urinary_urgency','cloudy_urine','blood_urine','urinary_dribbling'],
  skin_acne:['red_pimples','painful_pimples','pus_skin','oily_skin','purple_scars'],
  skin_rosacea:['red_nose','very_red_skin','purple_skin','hot_skin'],
  skin_psoriasis:['dry_scaly_rash','rash_near_joints','rash_groin_axilla','burning_skin'],
  pms:['breast_distension','menstrual_cramps','mood_swings'],




}
export function resolveClinicalContexts(selected:Record<string,AnswerState>){
 return Object.entries(rules).filter(([,ids])=>ids.some(id=>selected[id]==='yes')).map(([k])=>k)
}
