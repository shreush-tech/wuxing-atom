import {computeClinicalState} from './engine'

export const v086RegressionScenarios=[
  {name:'Spleen Qi cluster',answers:{bloating:'yes',worse_after_meals:'yes',fatigue:'yes',loose_stools:'yes',poor_appetite:'yes'},expectTop:'spleen_qi',expectResult:true},
  {name:'Liver Qi stagnation cluster',answers:{stress:'yes',sighing:'yes',plum_pit:'yes',worse_stress:'yes',rib_pain:'yes'},expectTop:'liver_stagnation',expectResult:true},
  {name:'Kidney Yin cluster',answers:{night_sweats:'yes',five_center_heat:'yes',tinnitus:'yes',dry_mouth:'yes',small_sips:'yes'},expectTop:'kidney_yin',expectResult:true},
  {name:'Kidney Yang cluster',answers:{cold:'yes',clear_urine:'yes',low_back:'yes',cold_feet:'yes',early_morning_diarrhea:'yes'},expectTop:'kidney_yang',expectResult:true},
  {name:'Lung Qi cluster',answers:{weak_voice:'yes',frequent_colds:'yes',short_breath:'yes',day_sweats:'yes'},expectTop:'lung_qi',expectResult:true},
  {name:'Heart Fire transcript cluster',answers:{near_total_insomnia:'yes',marked_agitation:'yes',mouth_ulcers:'yes',large_cold_gulps:'yes'},expectTop:'heart_fire',expectResult:true},
  {name:'Chest red flag blocks traditional result',answers:{chest_pain_radiates_arm:'yes',cold_sweat:'yes',short_breath:'yes'},expectTop:null,expectResult:false},
  {name:'New facial weakness blocks traditional result',answers:{facial_weakness:'yes',sudden_onset:'yes'},expectTop:null,expectResult:false}
] as const

export function runV086Regression(){
  return v086RegressionScenarios.map(s=>{
    const state=computeClinicalState(s.answers as any)
    const top=state.patterns[0]?.raw>0?state.patterns[0].id:null
    const pass=(s.expectTop===null || top===s.expectTop) && state.interview.canShowResult===s.expectResult
    return {name:s.name,top,canShowResult:state.interview.canShowResult,pass}
  })
}
