import type {AnswerState} from './types'

export type JourneyAction=
  | {type:'answer';id:string;value:AnswerState}
  | {type:'remove';id:string}

export interface DynamicJourney{
  id:string
  purpose:string
  steps:JourneyAction[]
  expectations:string[]
}

/**
 * Structural regression journeys only.
 * They exercise state reversibility, contradiction handling and visual response.
 * No new clinical weights or symptom-pattern associations are introduced here.
 */
export const dynamicClinicalJourneys:DynamicJourney[]=[
  {
    id:'wood_earth_emerges_then_weakens',
    purpose:'A relational Wood→Earth state should emerge only after relational evidence, then weaken when that evidence is removed.',
    steps:[
      {type:'answer',id:'bloating',value:'yes'},
      {type:'answer',id:'stress_bowel',value:'yes'},
      {type:'answer',id:'better_after_bm',value:'yes'},
      {type:'remove',id:'better_after_bm'}
    ],
    expectations:[
      'No relation from bloating alone.',
      'Relation may emerge after relational evidence.',
      'Removing relational evidence must trigger recomputation rather than leaving a stale halo.'
    ]
  },
  {
    id:'same_element_coexistence',
    purpose:'Two supported patterns in one element should be allowed to coexist without forced collapse.',
    steps:[
      {type:'answer',id:'bitter_taste',value:'yes'},
      {type:'answer',id:'red_face_eyes',value:'yes'},
      {type:'answer',id:'dizziness',value:'yes'},
      {type:'answer',id:'tinnitus',value:'yes'}
    ],
    expectations:[
      'The element can contain more than one supported pattern.',
      'Visual prominence may still prioritize only the strongest cues.'
    ]
  },
  {
    id:'cross_element_without_forced_halo',
    purpose:'Multiple active elements must not automatically create a Wu Xing relationship.',
    steps:[
      {type:'answer',id:'poor_sleep',value:'yes'},
      {type:'answer',id:'palpitations',value:'yes'},
      {type:'answer',id:'low_back',value:'yes'},
      {type:'answer',id:'tinnitus',value:'yes'}
    ],
    expectations:[
      'Fire and Water may both become active.',
      'A relationship remains hidden unless explicit relation rules are satisfied.'
    ]
  },
  {
    id:'contradiction_reduces_support',
    purpose:'A strong supportive cluster followed by a contradictory answer should reduce support without erasing unrelated evidence.',
    steps:[
      {type:'answer',id:'cold',value:'yes'},
      {type:'answer',id:'clear_urine',value:'yes'},
      {type:'answer',id:'night_sweats',value:'yes'}
    ],
    expectations:[
      'Contradictory evidence reduces the affected hypothesis.',
      'Other independently supported patterns remain available.'
    ]
  },
  {
    id:'safety_interrupts_mid_journey',
    purpose:'An urgent safety answer introduced after ordinary TCM answers must immediately block result reveal.',
    steps:[
      {type:'answer',id:'fatigue',value:'yes'},
      {type:'answer',id:'poor_appetite',value:'yes'},
      {type:'answer',id:'severe_chest_pain',value:'yes'}
    ],
    expectations:[
      'Safety is re-evaluated on every recomputation.',
      'Traditional result reveal is blocked after the urgent answer.'
    ]
  }
]
