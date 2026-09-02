import type { AnswerState } from './types'

export type LowBackDifferential='damp_cold'|'damp_heat'|'blood_stasis'|'open'

export function lowBackDifferential(a:Record<string,AnswerState|undefined>){
  const yes=(id:string)=>a[id]==='yes'
  const scores={
    damp_cold:[
      ['low_back_cold_heavy',3],['worse_cold_rain',3],['better_rest',1]
    ] as [string,number][],
    damp_heat:[
      ['hot_swollen_back',3],['worse_hot_humid',3],['thirst',2],['dark_urine',2]
    ] as [string,number][],
    blood_stasis:[
      ['fixed_piercing_back',3],['worse_pressure',2],['worse_evening',2]
    ] as [string,number][],
  }
  const ranked=Object.entries(scores).map(([id,items])=>({
    id:id as Exclude<LowBackDifferential,'open'>,
    score:items.filter(([s])=>yes(s)).reduce((sum,[,w])=>sum+w,0),
    evidence:items.filter(([s])=>yes(s)).map(([s])=>s)
  })).sort((a,b)=>b.score-a.score)

  const first=ranked[0],second=ranked[1]
  if(!first || first.score<5 || first.score-(second?.score||0)<2)return {id:'open' as const,score:first?.score||0,evidence:first?.evidence||[]}
  return first
}
