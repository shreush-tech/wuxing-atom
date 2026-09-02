import type {AnswerState,PatternId} from './types'

type Evidence={symptomId:string;weight:number}
type Rule={pattern:PatternId;support:Evidence[];clusterBonus?:{requires:string[];weight:number}}

const rules:Rule[]=[
  {pattern:'heart_blood',support:[
    {symptomId:'difficulty_falling_asleep',weight:2.5}
  ]},
  {pattern:'heart_yin',support:[
    {symptomId:'dream_disturbed',weight:2},
    {symptomId:'night_sweats',weight:1.5},
    {symptomId:'small_sips',weight:1.5}
  ]},
  {pattern:'heart_qi',support:[
    {symptomId:'day_sweats',weight:2}
  ]},
  {pattern:'heart_phlegm_fire',support:[
    {symptomId:'changing_nightmares',weight:2},
    {symptomId:'nightmares',weight:1}
  ]},
  {pattern:'heart_fire',support:[
    {symptomId:'near_total_insomnia',weight:3},
    {symptomId:'marked_agitation',weight:2},
    {symptomId:'mouth_ulcers',weight:2},
    {symptomId:'large_cold_gulps',weight:1.5}
  ],clusterBonus:{requires:['near_total_insomnia','marked_agitation','mouth_ulcers'],weight:2}},
  {pattern:'liver_stagnation',support:[
    {symptomId:'waking_1_3',weight:1.5},
    {symptomId:'sighing',weight:2},
    {symptomId:'plum_pit',weight:2},
    {symptomId:'worse_stress',weight:1}
  ]},
  {pattern:'liver_fire',support:[
    {symptomId:'large_cold_gulps',weight:1},
    {symptomId:'red_eyes',weight:2},
    {symptomId:'bitter_taste',weight:2}
  ]},
  {pattern:'stomach_fire',support:[
    {symptomId:'large_cold_gulps',weight:2},
    {symptomId:'constant_hunger',weight:2},
    {symptomId:'bad_breath',weight:2}
  ]},
  {pattern:'stomach_yin',support:[
    {symptomId:'small_sips',weight:2},
    {symptomId:'dry_mouth',weight:1.5}
  ]},
  {pattern:'kidney_yang',support:[
    {symptomId:'early_morning_diarrhea',weight:3},
    {symptomId:'cold',weight:1.5},
    {symptomId:'edema',weight:1}
  ]},
  {pattern:'kidney_qi',support:[
    {symptomId:'urinary_dribbling',weight:2}
  ]},
  {pattern:'kidney_yin',support:[
    {symptomId:'five_center_heat',weight:2},
    {symptomId:'night_sweats',weight:2},
    {symptomId:'small_sips',weight:1}
  ]},
  {pattern:'kidney_essence',support:[
    {symptomId:'low_pitch_tinnitus',weight:1.5}
  ]},
  {pattern:'spleen_qi',support:[
    {symptomId:'worse_after_meals',weight:2},
    {symptomId:'loose_stools',weight:2},
    {symptomId:'fatigue',weight:1},
    {symptomId:'bleeding_easy',weight:.5}
  ]},
  {pattern:'spleen_qi_sinking',support:[
    {symptomId:'bearing_down',weight:2},
    {symptomId:'varicose_veins',weight:1}
  ]},
  {pattern:'spleen_not_holding_blood',support:[
    {symptomId:'bleeding_easy',weight:2}
  ]},
  {pattern:'lung_qi',support:[
    {symptomId:'weak_voice',weight:2},
    {symptomId:'frequent_colds',weight:2},
    {symptomId:'day_sweats',weight:1}
  ]},
  {pattern:'kidney_receive_lung',support:[
    {symptomId:'difficulty_inhaling',weight:2}
  ]}
]

export function scoreAuthorTranscriptRules(selected:Record<string,AnswerState>){
  const out:Array<{id:PatternId;evidence:Evidence[];source:'author_transcript'}>=[]
  for(const r of rules){
    const ev=r.support.filter(x=>selected[x.symptomId]==='yes').map(x=>({...x}))
    if(r.clusterBonus && r.clusterBonus.requires.every(id=>selected[id]==='yes')){
      ev.push({symptomId:`cluster:${r.clusterBonus.requires.join('+')}`,weight:r.clusterBonus.weight})
    }
    if(ev.length)out.push({id:r.pattern,evidence:ev,source:'author_transcript'})
  }
  return out
}
