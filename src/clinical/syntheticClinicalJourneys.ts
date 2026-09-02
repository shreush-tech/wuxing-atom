import type {AnswerState,PatternId} from './types'
export interface SyntheticClinicalJourney{id:string;description:string;answers:Record<string,AnswerState>;expectedAny:PatternId[];expectRelationship:boolean}
export const syntheticClinicalJourneys:SyntheticClinicalJourney[]=[
{id:'earth_digestive',description:'Existing Earth digestive cluster.',answers:{bloating:'yes',worse_after_meals:'yes',poor_appetite:'yes',fatigue:'yes'},expectedAny:['spleen_qi'],expectRelationship:false},
{id:'wood_headache',description:'Existing Wood headache/heat cluster.',answers:{headache:'yes',temporal_headache:'yes',bitter_taste:'yes',red_face_eyes:'yes'},expectedAny:['liver_fire','liver_yang_rising'],expectRelationship:false},
{id:'wood_earth_relation',description:'Existing relational digestive evidence.',answers:{bloating:'yes',stress_bowel:'yes',better_after_bm:'yes',sighing:'yes'},expectedAny:['liver_spleen','liver_stagnation'],expectRelationship:true},
{id:'water_low_back',description:'Existing low-back deficiency cluster.',answers:{low_back:'yes',tinnitus:'yes',night_sweats:'yes',dry_mouth:'yes'},expectedAny:['kidney_yin','kidney_qi'],expectRelationship:false},
{id:'fire_sleep',description:'Existing Heart/sleep cluster.',answers:{poor_sleep:'yes',difficulty_falling_asleep:'yes',palpitations:'yes',poor_memory:'yes'},expectedAny:['heart_blood','heart_yin','heart_qi'],expectRelationship:false},
{id:'safety_block',description:'Urgent safety answer blocks result.',answers:{severe_chest_pain:'yes',fatigue:'yes'},expectedAny:[],expectRelationship:false}
]
