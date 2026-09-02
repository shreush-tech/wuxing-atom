export type ClinicalCrosswalk={
 diagnosisId:string
 questionFocus:string[]
 source:'uploaded_reference_book'
 rule:'context_only'
}

/**
 * Initial high-value crosswalks based on named disorder sections/tables in the uploaded book.
 * questionFocus contains domains to investigate, not diagnoses to assert.
 */
export const clinicalDiagnosisCrosswalks:ClinicalCrosswalk[]=[
 {diagnosisId:'endometriosis',questionFocus:['menstrual_pain','bleeding_pattern','abdominal_pelvic_pain','heat_cold_modifiers','fatigue_digestive_context'],source:'uploaded_reference_book',rule:'context_only'},
 {diagnosisId:'carpal_tunnel',questionFocus:['pain_quality','numbness','swelling_damp_context','blood_qi_deficiency_context'],source:'uploaded_reference_book',rule:'context_only'},
 {diagnosisId:'fibromyalgia',questionFocus:['widespread_pain','fatigue','sleep','digestive_context','heat_cold','stress_emotional_context'],source:'uploaded_reference_book',rule:'context_only'},
 {diagnosisId:'migraine',questionFocus:['headache_location','dizziness','visual_context','stress_irritability','phlegm_digestive_context','heat_signs'],source:'uploaded_reference_book',rule:'context_only'},
 {diagnosisId:'acid_reflux',questionFocus:['burning','fullness','stress_relation','heat_cold_modifiers','bitter_taste'],source:'uploaded_reference_book',rule:'context_only'},
 {diagnosisId:'ibs',questionFocus:['stool_pattern','stress_relation','pain_relief_after_bm','bloating','fatigue','heat_cold_modifiers'],source:'uploaded_reference_book',rule:'context_only'}
]

export function questionFocusForClinicalDiagnoses(ids:string[]){
 return [...new Set(clinicalDiagnosisCrosswalks.filter(x=>ids.includes(x.diagnosisId)).flatMap(x=>x.questionFocus))]
}
