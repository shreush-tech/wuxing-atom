import type {AnswerState} from './types'

export type ContextPatternRule={
  id:string
  label:string
  family:'qi'|'blood'|'yin-yang'|'phlegm-damp'|'wind'|'cold-heat'|'gynecology'|'mixed'
  contexts:string[]
  signature:string[]
  minSigns:number
  source:'uploaded_reference_book'
}

/*
These are not universal Zang-Fu diagnoses. They are recurring pattern labels
used by the uploaded book inside symptom/disorder tables. The engine keeps
them contextual instead of silently pretending every disease-specific label
is a universal organ pattern.
*/
export const contextualPatternRules:ContextPatternRule[]=[
 {id:'blood_deficiency',label:'Deficiência de Sangue',family:'blood',contexts:['constipation','amenorrhea','scanty_menses'],signature:['pale_face','dizziness','poor_memory','poor_sleep','dry_skin','blurred_vision'],minSigns:3,source:'uploaded_reference_book'},
 {id:'qi_deficiency',label:'Deficiência de Qi',family:'qi',contexts:['constipation','fatigue'],signature:['fatigue','short_breath','day_sweats','pale_face'],minSigns:3,source:'uploaded_reference_book'},
 {id:'yin_deficiency',label:'Deficiência de Yin',family:'yin-yang',contexts:['constipation','mania'],signature:['dry_mouth','five_center_heat','night_sweats','red_cheeks','poor_sleep'],minSigns:3,source:'uploaded_reference_book'},
 {id:'yang_def_internal_cold',label:'Deficiência de Yang com Frio Interno',family:'yin-yang',contexts:['constipation'],signature:['cold_body','cold_feet','edema','low_back','fatigue'],minSigns:3,source:'uploaded_reference_book'},
 {id:'blood_stasis',label:'Estase de Sangue',family:'blood',contexts:['headache','tinnitus','menstrual','mood'],signature:['pain_fixed','pain_worse_night','dark_face','varicose_veins'],minSigns:2,source:'uploaded_reference_book'},
 {id:'qi_blood_stasis',label:'Estagnação de Qi e Sangue',family:'blood',contexts:['amenorrhea','depression','pain'],signature:['irritable','bloating','rib_pain','pain_fixed'],minSigns:3,source:'uploaded_reference_book'},
 {id:'cold_blood_stasis',label:'Frio com Estase de Sangue',family:'cold-heat',contexts:['amenorrhea','menstrual'],signature:['cold_body','pain_fixed','better_warmth'],minSigns:2,source:'uploaded_reference_book'},
 {id:'phlegm_damp',label:'Fleuma-Umidade',family:'phlegm-damp',contexts:['amenorrhea','digestive','neurological'],signature:['phlegm','heavy_limbs','nausea','bloating'],minSigns:3,source:'uploaded_reference_book'},
 {id:'phlegm_qi_stagnation',label:'Fleuma com Estagnação de Qi',family:'phlegm-damp',contexts:['depression','menopause','throat'],signature:['plum_pit','phlegm','rib_pain','head_heavy'],minSigns:3,source:'uploaded_reference_book'},
 {id:'phlegm_heat',label:'Fleuma-Calor',family:'phlegm-damp',contexts:['mood','neurological','respiratory'],signature:['yellow_phlegm','poor_sleep','bitter_taste','restless'],minSigns:3,source:'uploaded_reference_book'},
 {id:'wind_heat_phlegm',label:'Vento-Calor com Fleuma',family:'wind',contexts:['facial_pain'],signature:['burning_skin','red_face_eyes','dry_mouth','dizziness'],minSigns:3,source:'uploaded_reference_book'},
 {id:'wind_cold_phlegm',label:'Vento-Frio com Fleuma',family:'wind',contexts:['facial_pain'],signature:['pain_worse_cold','pale_face','phlegm'],minSigns:2,source:'uploaded_reference_book'},
 {id:'blood_def_liver_wind',label:'Deficiência de Sangue com Vento do Fígado',family:'wind',contexts:['neurological'],signature:['blurred_vision','poor_sleep','weak_limbs','tremor','dizziness','tinnitus'],minSigns:4,source:'uploaded_reference_book'},
 {id:'yang_ming_heat',label:'Calor Yang Ming',family:'cold-heat',contexts:['mania','constipation'],signature:['constipation','dark_urine','red_face_eyes','restless'],minSigns:3,source:'uploaded_reference_book'},
 {id:'liver_yang_yin_blood_stasis',label:'Ascensão do Yang do Fígado com Deficiência de Yin e Estase de Sangue',family:'mixed',contexts:['facial_pain','headache'],signature:['pain_fixed','night_sweats','poor_sleep','dizziness','red_cheeks','tinnitus'],minSigns:4,source:'uploaded_reference_book'},
 {id:'qi_def_blood_stasis',label:'Deficiência de Qi com Estase de Sangue',family:'mixed',contexts:['facial_pain','chronic_pain'],signature:['fatigue','day_sweats','pain_fixed','numbness'],minSigns:3,source:'uploaded_reference_book'},
 {id:'wind_damp_blood_stasis',label:'Vento-Umidade com Estase de Sangue',family:'wind',contexts:['joint_pain','gout'],signature:['pain_fixed','pain_worse_cold','joint_swelling','restricted_movement'],minSigns:3,source:'uploaded_reference_book'},
 {id:'wind_damp_heat_blood_stasis',label:'Vento-Umidade-Calor com Estase de Sangue',family:'wind',contexts:['joint_pain','gout'],signature:['joint_red','joint_swelling','thirst','constipation','dark_urine'],minSigns:3,source:'uploaded_reference_book'},
 {id:'phlegm_blood_stasis_meridians',label:'Fleuma e Estase de Sangue obstruindo os meridianos',family:'phlegm-damp',contexts:['joint_pain','gout','neurological','throat'],signature:['phlegm','pain_fixed','joint_swelling','numbness'],minSigns:3,source:'uploaded_reference_book'},
 {id:'qi_blood_def_wind_cold',label:'Deficiência de Qi e Sangue com Vento-Frio',family:'wind',contexts:['chronic_pain','joint_pain'],signature:['fatigue','pain_worse_cold','better_warmth','weak_limbs'],minSigns:3,source:'uploaded_reference_book'},
 {id:'blood_stasis_wind',label:'Estase de Sangue com Vento',family:'wind',contexts:['facial_paralysis','neurological'],signature:['pain_fixed','sudden_onset','facial_weakness'],minSigns:2,source:'uploaded_reference_book'},
 {id:'phlegm_headache',label:'Fleuma',family:'phlegm-damp',contexts:['headache'],signature:['head_heavy','dizziness','nausea','chest_fullness'],minSigns:3,source:'uploaded_reference_book'},
 {id:'liver_qi_blood_stasis_cognitive',label:'Estagnação do Qi do Fígado com Estase de Sangue',family:'mixed',contexts:['cognitive','mood'],signature:['irritable','depressed','poor_memory','rib_pain','dark_face'],minSigns:3,source:'uploaded_reference_book'},
 {id:'liver_kidney_yin_phlegm_blood_stasis',label:'Deficiência de Yin do Fígado e Rim com Fleuma e Estase de Sangue',family:'mixed',contexts:['cognitive','neurological'],signature:['dizziness','numbness','poor_memory','red_cheeks','night_sweats','tremor'],minSigns:4,source:'uploaded_reference_book'},
 {id:'spleen_kidney_yang_phlegm_blood_stasis',label:'Deficiência de Yang do Baço e Rim com Fleuma e Estase de Sangue',family:'mixed',contexts:['cognitive','neurological'],signature:['slow_movement','weak_voice','poor_memory','numbness','cold_body','edema'],minSigns:4,source:'uploaded_reference_book'},
 {id:'liver_yin_internal_wind',label:'Deficiência de Yin do Fígado com Vento Interno',family:'wind',contexts:['tremor','parkinsonian'],signature:['tremor','muscle_stiffness','blurred_vision','constipation'],minSigns:3,source:'uploaded_reference_book'},
 {id:'liver_qi_blood_stasis_tremor',label:'Estagnação do Qi do Fígado com Estase de Sangue',family:'mixed',contexts:['tremor','parkinsonian'],signature:['tremor','pain_fixed','numbness','irritable'],minSigns:3,source:'uploaded_reference_book'},
 {id:'qi_blood_def_internal_wind',label:'Deficiência de Qi e Sangue com Vento Interno',family:'wind',contexts:['tremor','parkinsonian','neurological'],signature:['fatigue','depressed','dizziness','loose_stools','poor_memory','tremor'],minSigns:4,source:'uploaded_reference_book'},
 {id:'phlegm_fire_wind_spleen_qi',label:'Fleuma-Fogo agitando Vento com Deficiência de Qi do Baço',family:'mixed',contexts:['tremor','parkinsonian'],signature:['head_heavy','cold_limbs','poor_appetite','loose_stools','poor_sleep','anxiety','tremor'],minSigns:4,source:'uploaded_reference_book'},
 {id:'cold_heart_channel',label:'Frio no Canal do Coração',family:'cold-heat',contexts:['chest_pain'],signature:['chest_pain','cold_sweat','palpitations','pain_radiates_shoulder'],minSigns:3,source:'uploaded_reference_book'},
 {id:'liver_qi_heart_qi_def',label:'Estagnação do Qi do Fígado com Deficiência de Qi do Coração',family:'mixed',contexts:['chest_pain','mood'],signature:['chest_fullness','stress_worse','palpitations','fatigue','anxiety'],minSigns:4,source:'uploaded_reference_book'},
 {id:'qi_def_blood_stasis_wind',label:'Deficiência de Qi com Estase de Sangue e Vento',family:'wind',contexts:['stroke','neurological'],signature:['numbness','weak_limbs','sudden_onset','fatigue'],minSigns:3,source:'uploaded_reference_book'},
 {id:'yin_def_chronic_throat',label:'Deficiência de Yin',family:'yin-yang',contexts:['throat'],signature:['dry_throat','dry_mouth','low_back','night_sweats'],minSigns:3,source:'uploaded_reference_book'},
 {id:'phlegm_blood_stasis_throat',label:'Fleuma com Estase de Sangue',family:'phlegm-damp',contexts:['throat'],signature:['plum_pit','nausea','dark_phlegm','pain_fixed'],minSigns:3,source:'uploaded_reference_book'},

 {id:'heart_qi_blood_stasis_anxiety',label:'Deficiência de Qi do Coração com Estase de Sangue',family:'mixed',contexts:['anxiety'],signature:['palpitations','short_breath','fatigue','poor_sleep','headache','sighing'],minSigns:4,source:'uploaded_reference_book'},
 {id:'liver_qi_phlegm_fire_anxiety',label:'Estagnação do Qi do Fígado com Fleuma-Fogo',family:'phlegm-damp',contexts:['anxiety','mood'],signature:['anxiety','irritable','poor_sleep','chest_fullness','rib_pain','phlegm','constipation'],minSigns:4,source:'uploaded_reference_book'},
 {id:'heart_spleen_blood_depression',label:'Deficiência de Sangue do Coração e Baço',family:'blood',contexts:['depression','mood'],signature:['poor_sleep','palpitations','anxiety','poor_appetite','poor_memory','fatigue','pale_face'],minSigns:4,source:'uploaded_reference_book'},
 {id:'kidney_heart_liver_yin_depression',label:'Deficiência de Yin do Rim, Coração e Fígado',family:'yin-yang',contexts:['depression','mood'],signature:['poor_sleep','palpitations','dizziness','tinnitus','low_back','night_sweats','dry_mouth','irritable'],minSigns:5,source:'uploaded_reference_book'},
 {id:'urinary_fire',label:'Fogo em síndrome Lin urinária',family:'cold-heat',contexts:['urinary'],signature:['burning_urine','urinary_urgency','blood_urine','fever','bitter_taste','constipation'],minSigns:3,source:'uploaded_reference_book'},
 {id:'urinary_blood_stasis',label:'Estase de Sangue em síndrome Lin urinária',family:'blood',contexts:['urinary'],signature:['burning_urine','blood_clots_urine','pain_fixed','dark_face'],minSigns:3,source:'uploaded_reference_book'},
 {id:'urinary_kidney_yin',label:'Deficiência de Yin do Rim com sintomas urinários',family:'yin-yang',contexts:['urinary'],signature:['burning_urine','blood_urine','low_back','five_center_heat','poor_sleep','night_sweats'],minSigns:4,source:'uploaded_reference_book'},
 {id:'urinary_damp_heat',label:'Umidade-Calor em síndrome Lin urinária',family:'phlegm-damp',contexts:['urinary'],signature:['burning_urine','bitter_taste','heavy_limbs','cloudy_urine'],minSigns:3,source:'uploaded_reference_book'},
 {id:'urinary_kidney_qi',label:'Deficiência de Qi do Rim com sintomas urinários',family:'qi',contexts:['urinary'],signature:['cloudy_urine','urinary_difficulty','urinary_dribbling','low_back','fatigue','dizziness'],minSigns:4,source:'uploaded_reference_book'},

 {id:'acne_lung_heat',label:'Calor do Pulmão em acne',family:'cold-heat',contexts:['skin_acne'],signature:['red_pimples','red_face_eyes','allergies','cough_easy'],minSigns:3,source:'uploaded_reference_book'},
 {id:'acne_spleen_qi_phlegm_damp',label:'Deficiência de Qi do Baço com Fleuma-Umidade em acne',family:'phlegm-damp',contexts:['skin_acne'],signature:['pale_eruptions','oozing_skin','loose_stools','fatigue','bloating','head_heavy'],minSigns:4,source:'uploaded_reference_book'},
 {id:'acne_st_heat_li_damp_heat',label:'Calor do Estômago com Umidade-Calor do Intestino Grosso em acne',family:'cold-heat',contexts:['skin_acne'],signature:['red_pimples','pus_skin','oily_skin','constipation','dark_urine','acid_reflux'],minSigns:4,source:'uploaded_reference_book'},
 {id:'acne_blood_stasis',label:'Estase de Sangue em acne',family:'blood',contexts:['skin_acne'],signature:['purple_scars','bleeding_pimples','painful_pimples','dark_lips_nails'],minSigns:3,source:'uploaded_reference_book'},
 {id:'acne_toxic_heat',label:'Calor Tóxico em acne',family:'cold-heat',contexts:['skin_acne'],signature:['large_inflamed_pimples','pus_abscesses','painful_pimples'],minSigns:2,source:'uploaded_reference_book'},

 {id:'rosacea_st_lu_heat',label:'Calor de Estômago e Pulmão em rosácea',family:'cold-heat',contexts:['skin_rosacea'],signature:['red_nose','hot_skin','bitter_taste','dry_stool','dark_urine','heartburn'],minSigns:4,source:'uploaded_reference_book'},
 {id:'rosacea_toxic_heat',label:'Calor Tóxico em rosácea',family:'cold-heat',contexts:['skin_rosacea'],signature:['pus_skin','thick_red_skin','constipation','irritable','poor_sleep'],minSigns:3,source:'uploaded_reference_book'},
 {id:'rosacea_blood_stasis_heat',label:'Estase de Sangue com Calor em rosácea',family:'blood',contexts:['skin_rosacea'],signature:['very_red_skin','purple_skin','hot_skin','constipation'],minSigns:3,source:'uploaded_reference_book'},

 {id:'psoriasis_damp_heat',label:'Umidade-Calor em psoríase',family:'phlegm-damp',contexts:['skin_psoriasis'],signature:['rash_groin_axilla','worse_damp_weather','pus_skin','bloody_skin','irritable','bloating','smelly_diarrhea_mucus'],minSigns:4,source:'uploaded_reference_book'},
 {id:'psoriasis_cold_damp',label:'Frio-Umidade em psoríase',family:'phlegm-damp',contexts:['skin_psoriasis'],signature:['rash_near_joints','joint_pain','joint_swelling','worse_cold_rain','cold_body','bloating'],minSigns:4,source:'uploaded_reference_book'},
 {id:'psoriasis_toxic_fire',label:'Fogo Tóxico em psoríase',family:'cold-heat',contexts:['skin_psoriasis'],signature:['very_red_skin','pus_skin','burning_skin','constipation','fever','cold_drinks','poor_sleep'],minSigns:4,source:'uploaded_reference_book'},

 {id:'digestive_earth_cluster',label:'Padrões digestivos Terra (Baço/Estômago/Intestino Grosso)',family:'mixed',contexts:['digestive'],signature:['bloating','poor_appetite','fatigue','loose_stools','acid_reflux','constipation'],minSigns:3,source:'uploaded_reference_book'},

 {id:'constipation_li_heat',label:'Calor do Intestino Grosso',family:'cold-heat',contexts:['constipation'],signature:['hard_dry_stool','red_face_eyes','bad_breath','dark_urine','thirst','irritable'],minSigns:3,source:'uploaded_reference_book'},
 {id:'constipation_yang_ming',label:'Síndrome Yang Ming',family:'cold-heat',contexts:['constipation'],signature:['constipation','smelly_dry_stool','bloating','sweating','thirst'],minSigns:3,source:'uploaded_reference_book'},
 {id:'constipation_food_stagnation',label:'Estagnação de Alimentos',family:'mixed',contexts:['constipation','digestive'],signature:['constipation_diarrhea_alternating','nausea','gas','belching','acid_reflux'],minSigns:3,source:'uploaded_reference_book'},
 {id:'constipation_liver_qi',label:'Estagnação do Qi do Fígado',family:'qi',contexts:['constipation'],signature:['incomplete_bowel','stress_worse','gas','bloating','irritable','depressed','sighing','rib_pain'],minSigns:4,source:'uploaded_reference_book'},
 {id:'constipation_phlegm',label:'Fleuma em constipação crônica',family:'phlegm-damp',contexts:['constipation'],signature:['mucus_stool','poor_concentration','heavy_limbs','head_heavy','oily_skin','fatigue','dizziness'],minSigns:4,source:'uploaded_reference_book'},

 {id:'amenorrhea_liver_blood_kidney_yang',label:'Deficiência de Sangue do Fígado e Yang do Rim',family:'mixed',contexts:['amenorrhea'],signature:['fatigue','low_back','dizziness','depressed','cold_body','pale_face','brittle_nails'],minSigns:4,source:'uploaded_reference_book'},
 {id:'amenorrhea_blood_def',label:'Deficiência de Sangue',family:'blood',contexts:['amenorrhea'],signature:['dizziness','blurred_vision','numbness','poor_memory','poor_sleep','anxiety','dry_skin'],minSigns:4,source:'uploaded_reference_book'},
 {id:'amenorrhea_sp_kd_yang',label:'Deficiência de Yang do Baço e Rim',family:'yin-yang',contexts:['amenorrhea'],signature:['fatigue','loose_stools','cold_limbs','poor_appetite','low_back','bloating'],minSigns:4,source:'uploaded_reference_book'},
 {id:'amenorrhea_lv_kd_yin',label:'Deficiência de Yin do Fígado e Rim',family:'yin-yang',contexts:['amenorrhea'],signature:['dizziness','dry_eyes','blurred_vision','poor_sleep','low_back','night_sweats','tinnitus'],minSigns:4,source:'uploaded_reference_book'},
 {id:'amenorrhea_ht_kd_yin',label:'Deficiência de Yin do Coração e Rim',family:'yin-yang',contexts:['amenorrhea'],signature:['palpitations','poor_sleep','night_sweats','red_cheeks','anxiety','dizziness','low_back','tinnitus'],minSigns:5,source:'uploaded_reference_book'},
 {id:'amenorrhea_ht_sp_blood',label:'Deficiência de Sangue do Coração e Baço',family:'blood',contexts:['amenorrhea'],signature:['palpitations','anxiety','poor_sleep','fatigue','poor_appetite','loose_stools'],minSigns:4,source:'uploaded_reference_book'},
 {id:'amenorrhea_qi_blood_stagnation',label:'Estagnação de Qi e Sangue',family:'blood',contexts:['amenorrhea'],signature:['irritable','mood_swings','bloating','abdominal_pain'],minSigns:3,source:'uploaded_reference_book'},
 {id:'amenorrhea_cold_blood_stasis',label:'Frio e Estase de Sangue',family:'cold-heat',contexts:['amenorrhea'],signature:['abdominal_pain','better_warmth','cold_body'],minSigns:3,source:'uploaded_reference_book'},
 {id:'amenorrhea_phlegm_damp_uterus',label:'Fleuma-Umidade no Útero',family:'phlegm-damp',contexts:['amenorrhea'],signature:['fatigue','heavy_limbs','nausea','sticky_vaginal_discharge'],minSigns:3,source:'uploaded_reference_book'},

 {id:'pms_liver_qi',label:'Estagnação do Qi do Fígado na TPM',family:'qi',contexts:['pms'],signature:['breast_distension','irritable','mood_swings','sighing'],minSigns:3,source:'uploaded_reference_book'},
 {id:'pms_liver_blood_stasis',label:'Estase de Sangue do Fígado na TPM',family:'blood',contexts:['pms'],signature:['breast_distension','breast_hardness','menstrual_clots','menstrual_cramps','irritable'],minSigns:3,source:'uploaded_reference_book'},
 {id:'pms_phlegm_liver_qi',label:'Fleuma com Estagnação do Qi do Fígado na TPM',family:'phlegm-damp',contexts:['pms'],signature:['breast_distension','breast_nodules','irritable','irregular_period'],minSigns:3,source:'uploaded_reference_book'}

]

export function scoreContextualPatterns(selected:Record<string,AnswerState>,contexts:string[]){
 return contextualPatternRules.flatMap(r=>{
   if(!r.contexts.some(c=>contexts.includes(c)))return []
   const evidence=r.signature.filter(s=>selected[s]==='yes')
   if(evidence.length<r.minSigns)return []
   return [{...r,evidence,raw:evidence.length}]
 }).sort((a,b)=>b.raw-a.raw)
}
