import { nextMicroQuestions } from './microInterviews'
import { lowBackDifferential } from './painDifferentials'
import { computeClinicalState } from './engine'

export const microCases=[
  {
    name:'Digestive entry prioritizes timing/stress',
    answers:{bloating:'yes'},
    expectPath:'digestion',
    expectedQuestions:['worse_after_meals','worse_stress']
  },
  {
    name:'Sleep entry asks architecture of sleep',
    answers:{poor_sleep:'yes'},
    expectPath:'sleep',
    expectedQuestions:['difficulty_falling_asleep','frequent_waking','dream_disturbed']
  },
  {
    name:'Headache entry localizes temporal pain',
    answers:{headache:'yes'},
    expectPath:'headache',
    expectedQuestions:['temporal_headache']
  },
  {
    name:'Low-back entry asks pain behaviour',
    answers:{low_back:'yes'},
    expectPath:'low_back',
    expectedQuestions:['low_back_cold_heavy']
  }
] as const

export function runMicroCases(){
  return microCases.map(c=>{
    const r=nextMicroQuestions(c.answers as any,3)
    const ids=r.questions.map(q=>q.id)
    return {
      name:c.name,
      path:r.path?.id,
      questions:ids,
      pass:r.path?.id===c.expectPath && c.expectedQuestions.every(x=>ids.includes(x))
    }
  })
}

export const differentialCases=[
  {name:'Damp Cold',answers:{low_back:'yes',low_back_cold_heavy:'yes',worse_cold_rain:'yes'},expect:'damp_cold'},
  {name:'Damp Heat',answers:{low_back:'yes',hot_swollen_back:'yes',worse_hot_humid:'yes',thirst:'yes'},expect:'damp_heat'},
  {name:'Blood Stasis',answers:{low_back:'yes',fixed_piercing_back:'yes',worse_pressure:'yes',worse_evening:'yes'},expect:'blood_stasis'},
  {name:'Open with one vague sign',answers:{low_back:'yes',worse_evening:'yes'},expect:'open'},
] as const

export function runDifferentialCases(){
  return differentialCases.map(c=>{
    const got=lowBackDifferential(c.answers as any).id
    return {name:c.name,got,pass:got===c.expect}
  })
}

export const clinicalScenarios=[
  {
    name:'Sleep heat-deficiency cluster should favor Heart Yin over Heart Blood',
    answers:{poor_sleep:'yes',difficulty_falling_asleep:'yes',palpitations:'yes',dream_disturbed:'yes',night_sweats:'yes',dry_mouth:'yes',five_center_heat:'yes'}
  },
  {
    name:'Digestive stress cluster should favor Liver-Spleen relation',
    answers:{bloating:'yes',worse_stress:'yes',stress_bowel:'yes',better_after_bm:'yes',gas:'yes',diarrhea:'yes'}
  },
  {
    name:'Headache heat cluster should separate Liver Fire from Yang Rising',
    answers:{headache:'yes',temporal_headache:'yes',red_face_eyes:'yes',bitter_taste:'yes',thirst:'yes',dark_urine:'yes'}
  }
] as const

export function inspectClinicalScenarios(){
  return clinicalScenarios.map(c=>{
    const st=computeClinicalState(c.answers as any)
    return {
      name:c.name,
      top:st.patterns.slice(0,3).map(p=>({id:p.id,raw:p.raw})),
      readiness:st.interview.readiness,
      relation:st.relationship?.id||null
    }
  })
}
