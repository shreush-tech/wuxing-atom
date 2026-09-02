import type { AnswerState, PatternId } from './types'

type Answers=Record<string,AnswerState|undefined>
export interface OverlayScore{
  id:PatternId
  delta:number
  evidence:{symptomId:string;contribution:number;kind:'support'|'contradiction'}[]
}

const has=(a:Answers,id:string)=>a[id]==='yes'

function cluster(a:Answers, id:PatternId, entries:[string,number][], minimum=2):OverlayScore{
  const hits=entries.filter(([s])=>has(a,s))
  const raw=hits.length>=minimum?hits.reduce((sum,[,w])=>sum+w,0):Math.min(2,hits.reduce((sum,[,w])=>sum+w,0))
  return {id,delta:raw,evidence:hits.map(([symptomId,contribution])=>({symptomId,contribution,kind:'support'}))}
}

export function complaintOverlays(a:Answers):OverlayScore[]{
  return [
    // Digestive clusters
    cluster(a,'spleen_qi',[['bloating',2],['worse_after_meals',2],['poor_appetite',2],['fatigue',2],['diarrhea',2],['better_warmth',1]],3),
    cluster(a,'spleen_yang',[['bloating',2],['worse_raw_cold_food',2],['better_warmth',2],['cold_limbs',2],['diarrhea',2],['fatigue',1]],3),
    cluster(a,'stomach_yin',[['bloating',1],['evening_worse',2],['dry_mouth',2],['dry_stool',2],['night_sweats',2]],3),
    cluster(a,'liver_spleen',[['worse_stress',3],['bloating',2],['gas',2],['diarrhea',2],['better_after_bm',3]],3),
    cluster(a,'food_stagnation',[['worse_after_meals',2],['gas',2],['belching',2],['sour_reflux',2],['nausea',2]],3),

    // Sleep clusters from insomnia table
    cluster(a,'heart_blood',[['difficulty_falling_asleep',2],['frequent_waking',1],['dream_disturbed',2],['palpitations',2],['poor_memory',2],['fatigue',1]],3),
    cluster(a,'heart_yin',[['difficulty_falling_asleep',2],['palpitations',2],['dream_disturbed',2],['night_sweats',2],['dry_mouth',2],['five_center_heat',2]],3),
    cluster(a,'kidney_yin',[['waking_1_3',1],['night_sweats',2],['dry_mouth',2],['five_center_heat',2],['low_back',1],['tinnitus',1]],3),

    // Headache clusters
    cluster(a,'liver_yang_rising',[['temporal_headache',3],['dizziness',2],['tinnitus',2],['dry_mouth',1],['dry_eyes',1],['poor_sleep',1],['red_face_eyes',1]],3),
    cluster(a,'liver_fire',[['temporal_headache',3],['red_face_eyes',2],['bitter_taste',2],['thirst',2],['constipation',1],['dark_urine',1],['dizziness',1],['tinnitus',1]],3),

    // Kidney deficiency overlays in lower-back path
    cluster(a,'kidney_yang',[['low_back',2],['cold_limbs',2],['better_warmth',2],['clear_urine',2],['fatigue',1]],3),
    cluster(a,'kidney_yin',[['low_back',2],['night_sweats',2],['dry_mouth',2],['tinnitus',2],['dizziness',1]],3),
  ]
}
