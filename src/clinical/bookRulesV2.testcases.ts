import { scoreBookRulesV2 } from './bookRulesV2'

export const syntheticCases=[
  {name:'Heart Qi cluster',answers:{palpitations:'yes',short_breath:'yes',fatigue:'yes',sweating:'yes'},expect:'heart_qi'},
  {name:'Heart Yang cluster',answers:{palpitations:'yes',cold_limbs:'yes',fatigue:'yes',heart_discomfort:'yes'},expect:'heart_yang'},
  {name:'Large Intestine Heat cluster',answers:{constipation:'yes',dry_stool:'yes',thirst:'yes',dark_urine:'yes'},expect:'large_intestine_heat'},
  {name:'Food Stagnation cluster',answers:{nausea:'yes',gas:'yes',belching:'yes',sour_reflux:'yes'},expect:'food_stagnation'},
  {name:'Liver Yang Rising cluster',answers:{headache:'yes',dizziness:'yes',tinnitus:'yes',red_face_eyes:'yes'},expect:'liver_yang_rising'},
] as const

export function runSyntheticCases(){
  return syntheticCases.map(c=>{
    const scores=scoreBookRulesV2(c.answers as any).sort((a,b)=>b.raw-a.raw)
    return {name:c.name,expected:c.expect,got:scores[0]?.id,pass:scores[0]?.id===c.expect}
  })
}
