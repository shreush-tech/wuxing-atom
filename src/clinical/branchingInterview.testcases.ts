import { branchDecision } from './branchingInterview'

export const branchCases=[
  {
    name:'Digestive entry stays simple',
    answers:{bloating:'yes'},
    phase:'entry',
    questions:['worse_after_meals','worse_stress']
  },
  {
    name:'Digestive stress branch',
    answers:{bloating:'yes',worse_after_meals:'no',worse_stress:'yes'},
    phase:'branch',
    questions:['better_after_bm','gas']
  },
  {
    name:'Sleep onset branch',
    answers:{poor_sleep:'yes',difficulty_falling_asleep:'yes',frequent_waking:'no'},
    phase:'branch',
    questions:['palpitations','night_sweats']
  },
  {
    name:'Headache heat discriminator branch',
    answers:{headache:'yes',temporal_headache:'yes',dizziness:'no'},
    phase:'branch',
    questions:['red_face_eyes','bitter_taste']
  },
  {
    name:'Low-back fixed pain branch',
    answers:{low_back:'yes',low_back_cold_heavy:'no',fixed_piercing_back:'yes'},
    phase:'branch',
    questions:['worse_pressure','worse_evening']
  }
] as const

export function runBranchCases(){
  return branchCases.map(c=>{
    const d=branchDecision(c.answers as any)
    const got=d.questions.map(q=>q.id)
    return {
      name:c.name,
      phase:d.phase,
      got,
      pass:d.phase===c.phase && c.questions.every(q=>got.includes(q)) && got.length<=2
    }
  })
}
