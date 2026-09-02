import { computeSafety } from './safetyGate'
import { computeClinicalState } from './engine'

export const safetyCases=[
  {name:'severe chest pain stops result',answers:{fatigue:'yes',palpitations:'yes',severe_chest_pain:'yes'},level:'urgent',continue:false},
  {name:'sudden severe headache stops result',answers:{headache:'yes',severe_sudden_headache:'yes'},level:'urgent',continue:false},
  {name:'cauda equina style cluster stops result',answers:{low_back:'yes',saddle_anesthesia_bladder:'yes'},level:'urgent',continue:false},
  {name:'weight loss raises caution',answers:{bloating:'yes',unexplained_weight_loss:'yes'},level:'caution',continue:true},
  {name:'radiating chest pain stops result',answers:{chest_pain_radiates_arm:'yes',cold_sweat:'yes',short_breath:'yes'},level:'urgent',continue:false},
  {name:'facial weakness stops result',answers:{facial_weakness:'yes',sudden_onset:'yes'},level:'urgent',continue:false},
  {name:'ordinary fatigue remains clear',answers:{fatigue:'yes'},level:'clear',continue:true},
] as const

export function runSafetyCases(){
  return safetyCases.map(c=>{
    const s=computeSafety(c.answers as any)
    const state=computeClinicalState(c.answers as any)
    return {
      name:c.name,
      level:s.level,
      canContinue:s.canContinue,
      canShowResult:state.interview.canShowResult,
      pass:s.level===c.level && s.canContinue===c.continue && (!c.continue ? !state.interview.canShowResult : true)
    }
  })
}
