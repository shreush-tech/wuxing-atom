import type {AnswerState,PatternId} from './types'

export type HallmarkRule={
  symptomId:string
  patterns:Array<{id:PatternId;weight:number}>
  note:string
}

export const hallmarkRules:HallmarkRule[]=[
  {symptomId:'mouth_ulcers',patterns:[{id:'heart_fire',weight:3},{id:'stomach_phlegm_fire',weight:2}],note:'Oral ulcers are not treated as exclusive to one pattern.'},
  {symptomId:'bleeding_gums',patterns:[{id:'stomach_fire',weight:4},{id:'stomach_phlegm_fire',weight:2}],note:'Swollen/bleeding gums are a high-information Stomach Heat/Fire clue in the book.'},
  {symptomId:'bitter_taste',patterns:[{id:'liver_fire',weight:3},{id:'heart_fire',weight:1},{id:'heart_phlegm_fire',weight:1}],note:'Bitter taste is highly informative but not exclusive to Liver Fire.'},
  {symptomId:'difficulty_inhaling',patterns:[{id:'kidney_receive_lung',weight:4}],note:'Difficulty inhaling is a characteristic discriminator for Kidney failing to receive Lung Qi.'},
  {symptomId:'urinary_dribbling',patterns:[{id:'kidney_qi_not_firm',weight:4}],note:'Post-urination dribbling strongly supports Kidney Qi not firm.'},
  {symptomId:'yellow_phlegm',patterns:[{id:'lung_phlegm_heat',weight:4}],note:'Profuse thick yellow-green phlegm strongly supports Phlegm-Heat in Lung.'},
  {symptomId:'white_watery_phlegm',patterns:[{id:'lung_phlegm_cold',weight:4},{id:'lung_phlegm_fluid',weight:3}],note:'White watery/frothy phlegm separates cold/fluid patterns from heat patterns.'},
  {symptomId:'smelly_diarrhea_mucus',patterns:[{id:'large_intestine_damp_heat',weight:4}],note:'Smelly diarrhea with mucus/blood and burning signs supports Damp-Heat in Large Intestine.'},
]

export function scoreHallmarks(selected:Record<string,AnswerState>){
  const out=new Map<PatternId,Array<{symptomId:string;weight:number}>>()
  for(const r of hallmarkRules){
    if(selected[r.symptomId]!=='yes')continue
    for(const p of r.patterns){
      const arr=out.get(p.id)||[]
      arr.push({symptomId:r.symptomId,weight:p.weight})
      out.set(p.id,arr)
    }
  }
  return out
}
