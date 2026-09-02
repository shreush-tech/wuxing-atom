import type { AnswerState, PatternId, SymptomId } from './types'

type Answers=Record<string,AnswerState|undefined>
export type BookRule={id:PatternId; support:[SymptomId,number][]; contradictions?:[SymptomId,number][]; minHits:number}

export const bookRulesV2:BookRule[]=[
  {id:'heart_qi',minHits:3,support:[['palpitations',3],['short_breath',2],['fatigue',2],['sweating',2],['pale',1]]},
  {id:'heart_yang',minHits:3,support:[['palpitations',3],['cold_limbs',2],['pale',1],['fatigue',2],['heart_discomfort',2]]},
  {id:'spleen_qi_sinking',minHits:3,support:[['bearing_down',3],['frequent_urine',1],['poor_appetite',2],['diarrhea',2],['fatigue',2]]},
  {id:'spleen_not_holding_blood',minHits:3,support:[['bleeding_easy',3],['poor_appetite',1],['bloating',2],['fatigue',2]]},
  {id:'stomach_yin',minHits:3,support:[['burning_stomach',2],['dry_mouth',2],['dry_stool',2],['night_sweats',2],['poor_sleep',1]]},
  {id:'large_intestine_heat',minHits:3,support:[['constipation',2],['dry_stool',3],['bad_breath',1],['dark_urine',2],['thirst',2],['stress',1]]},
  {id:'food_stagnation',minHits:3,support:[['constipation',1],['diarrhea',1],['nausea',2],['gas',2],['belching',2],['sour_reflux',2]]},
  {id:'liver_yang_rising',minHits:3,support:[['headache',2],['dizziness',2],['tinnitus',2],['dry_mouth',1],['poor_sleep',1],['red_face_eyes',2],['stress',2]]},
]

export function scoreBookRulesV2(answers:Answers){
  return bookRulesV2.map(rule=>{
    const evidence:{symptomId:SymptomId;kind:'support'|'contradiction';weight:number}[]=[]
    let raw=0,hits=0
    for(const [id,w] of rule.support){
      if(answers[id]==='yes'){raw+=w;hits++;evidence.push({symptomId:id,kind:'support',weight:w})}
      if(answers[id]==='no' && w>=3){raw-=.45;evidence.push({symptomId:id,kind:'contradiction',weight:-.45})}
    }
    for(const [id,w] of rule.contradictions||[]){
      if(answers[id]==='yes'){raw-=w;evidence.push({symptomId:id,kind:'contradiction',weight:-w})}
    }
    if(hits<rule.minHits){
      // Preserve the intended weak-candidate cap in the evidence itself.
      // The engine merges evidence item-by-item, so capping only `raw` here
      // previously had no effect and could over-promote incomplete patterns.
      const positive=evidence.filter(x=>x.kind==='support').reduce((sum,x)=>sum+x.weight,0)
      const cap=3
      if(positive>cap){
        const scale=cap/positive
        for(const item of evidence){
          if(item.kind==='support')item.weight*=scale
        }
      }
      raw=Math.min(raw,cap)
    }
    return {id:rule.id,raw,evidence}
  })
}
