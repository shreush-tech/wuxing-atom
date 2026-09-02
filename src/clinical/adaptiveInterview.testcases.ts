import { computeClinicalState } from './engine'

export const uncertaintyCases=[
  {
    name:'Kidney Yin vs Yang must remain open early',
    answers:{low_back:'yes'},
    expectCanShow:false
  },
  {
    name:'Kidney Yin becomes clearer',
    answers:{low_back:'yes',tinnitus:'yes',night_sweats:'yes',dry_mouth:'yes'},
    expectLead:'kidney_yin'
  },
  {
    name:'Kidney Yang becomes clearer',
    answers:{low_back:'yes',cold:'yes',clear_urine:'yes',cold_limbs:'yes'},
    expectLead:'kidney_yang'
  },
  {
    name:'Constipation alone must not force heat',
    answers:{constipation:'yes'},
    expectCanShow:false
  },
  {
    name:'Large Intestine Heat cluster',
    answers:{constipation:'yes',dry_stool:'yes',thirst:'yes',dark_urine:'yes',bad_breath:'yes'},
    expectLead:'large_intestine_heat'
  },
  {
    name:'Food stagnation cluster',
    answers:{nausea:'yes',gas:'yes',belching:'yes',sour_reflux:'yes'},
    expectLead:'food_stagnation'
  }
] as const

export function runUncertaintyCases(){
  return uncertaintyCases.map(c=>{
    const state=computeClinicalState(c.answers as any)
    const got=state.patterns[0]?.id
    return {
      name:c.name,
      got,
      canShow:state.interview.canShowResult,
      pass:('expectLead' in c ? got===c.expectLead : state.interview.canShowResult===c.expectCanShow)
    }
  })
}
