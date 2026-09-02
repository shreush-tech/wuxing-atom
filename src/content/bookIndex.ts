export type BookIndexCategory =
  | 'lung' | 'digestive' | 'neurological' | 'cardiovascular' | 'mental'
  | 'pain' | 'womens' | 'mens' | 'genitourinary' | 'skin' | 'cancer_support'
  | 'framework' | 'other'

export type BookIndexUse = 'clinical_diagnosis' | 'symptom_search' | 'both' | 'context_only'

export type BookIndexEntry = {
  id: string
  bookLabel: string
  labelPt: string
  category: BookIndexCategory
  use: BookIndexUse
  aliases?: string[]
  source: 'uploaded_reference_book'
  sourceScope: 'index_page_5_and_toc_pages_6_8'
}

const e=(id:string,bookLabel:string,labelPt:string,category:BookIndexCategory,use:BookIndexUse,aliases:string[]=[]):BookIndexEntry=>({
  id,bookLabel,labelPt,category,use,aliases,source:'uploaded_reference_book',sourceScope:'index_page_5_and_toc_pages_6_8'
})

/**
 * Search registry transcribed from the reference book's "INDEX of Disorders & Symptoms"
 * and grouped using its Table of Contents. The book intentionally mixes disorders and
 * symptoms, so UI eligibility is separate from source membership.
 */
export const bookIndexEntries:BookIndexEntry[]=[
  e('abdominal_bloating','Abdominal Bloating','Distensão / barriga estufada','digestive','symptom_search',['inchaço abdominal','empachamento']),
  e('abdominal_masses','Abdominal Masses','Massas abdominais','womens','clinical_diagnosis'),
  e('abdominal_pain','Abdominal Pain','Dor abdominal','digestive','symptom_search',['dor na barriga']),
  e('acne','Acne','Acne','skin','both'),
  e('acute_external_disorders','Acute External Disorders','Transtornos externos agudos','lung','context_only'),
  e('acid_reflux','Acid Reflux','Refluxo ácido','digestive','both',['azia','refluxo']),
  e('acute_soft_tissue_injuries','Acute Soft Tissue Injuries','Lesões agudas de tecidos moles','pain','clinical_diagnosis'),
  e('allergic_rhinitis','Allergic Rhinitis','Rinite alérgica','lung','clinical_diagnosis',['rinite']),
  e('alopecia_areata','Alopecia Areata','Alopecia areata','lung','clinical_diagnosis'),
  e('alzheimers','Alzheimer’s Disease','Doença de Alzheimer','mental','clinical_diagnosis'),
  e('amenorrhea','Amenorrhea','Amenorreia','womens','both',['ausência de menstruação']),
  e('angina','Angina Pectoris','Angina pectoris','cardiovascular','clinical_diagnosis'),
  e('anxiety','Anxiety','Ansiedade','mental','both'),
  e('rheumatoid_arthritis','Arthitis (Rheumatoid)','Artrite reumatoide','pain','clinical_diagnosis'),
  e('asthma','Asthma','Asma','lung','clinical_diagnosis'),
  e('attention_deficit','Attention Deficit Disorder','Transtorno de déficit de atenção','mental','clinical_diagnosis',['TDAH','TDA']),
  e('lower_back_pain','Back Pain (lower)','Dor lombar','pain','symptom_search',['lombalgia']),
  e('bad_breath','Bad Breath','Mau hálito','digestive','symptom_search',['halitose']),
  e('behcets','Behcet’s Syndrome','Síndrome de Behçet','neurological','clinical_diagnosis'),
  e('bells_palsy','Bell’s Palsy','Paralisia de Bell','neurological','clinical_diagnosis'),
  e('bph','Benign Prostate Hyperplasia','Hiperplasia prostática benigna','mens','clinical_diagnosis',['HPB']),
  e('bipolar','Bipolar Disorder','Transtorno bipolar','mental','clinical_diagnosis'),
  e('bladder_rectum_prolapse','Bladder & Rectum Prolapse','Prolapso de bexiga e reto','genitourinary','clinical_diagnosis'),
  e('bleeding_between_periods','Bleeding Between Periods','Sangramento entre menstruações','womens','symptom_search'),
  e('bone_fracture','Bone Fracture','Fratura óssea','pain','clinical_diagnosis'),
  e('breast_lump','Breast Lump','Nódulo mamário','womens','both'),
  e('breech_baby','Breech Baby','Apresentação pélvica do bebê','womens','context_only'),
  e('cancer_chemo','Cancer Support: Chemotherapy','Suporte durante quimioterapia','cancer_support','context_only'),
  e('cancer_pre_surgery','Cancer Support: Pre-Surgery','Suporte pré-operatório em câncer','cancer_support','context_only'),
  e('cancer_post_surgery','Cancer Support: Post-Surgery','Suporte pós-operatório em câncer','cancer_support','context_only'),
  e('cancer_radiation','Cancer Support: Radiation','Suporte durante radioterapia','cancer_support','context_only'),
  e('carpal_tunnel','Carpal Tunnel Syndrome','Síndrome do túnel do carpo','pain','clinical_diagnosis'),
  e('cva','Cerebral Vascular Accident','Acidente vascular cerebral','cardiovascular','clinical_diagnosis',['AVC']),
  e('chlamydia','Chlamydia','Clamídia','genitourinary','clinical_diagnosis'),
  e('chronic_fatigue','Chronic Fatigue Syndrome','Síndrome da fadiga crônica','neurological','clinical_diagnosis'),
  e('chronic_prostatitis','Chronic Prostatitis','Prostatite crônica','mens','clinical_diagnosis'),
  e('chronic_sinusitis','Chronic Sinusitis','Sinusite crônica','lung','clinical_diagnosis'),
  e('cold_diseases_6_stages','Cold diseases (6 Stages)','Doenças do Frio — 6 Estágios','framework','context_only'),
  e('constipation','Constipation','Constipação / intestino preso','digestive','symptom_search',['prisão de ventre']),
  e('convulsions','Convulsions','Convulsões','neurological','both'),
  e('cough','Cough','Tosse','lung','symptom_search'),
  e('crohns','Crohn’s Disease','Doença de Crohn','digestive','clinical_diagnosis'),
  e('delayed_period','Delayed Period','Menstruação atrasada','womens','symptom_search'),
  e('depression','Depression','Depressão','mental','clinical_diagnosis'),
  e('diabetes','Diabetes','Diabetes','digestive','clinical_diagnosis'),
  e('diarrhea','Diarrhea','Diarreia / intestino solto','digestive','symptom_search'),
  e('diverticulitis','Diverticulitis','Diverticulite','digestive','clinical_diagnosis'),
  e('dizziness_vertigo','Dizziness/Vertigo','Tontura / vertigem','neurological','symptom_search'),
  e('profuse_dreaming','Dreaming (profuse)','Sonhos excessivos / muito vívidos','mental','symptom_search'),
  e('dysmenorrhea','Dysmenorrhea','Dismenorreia / cólica menstrual','womens','both'),
  e('eczema','Eczema','Eczema','skin','clinical_diagnosis'),
  e('endometriosis','Endometriosis','Endometriose','womens','clinical_diagnosis'),
  e('epilepsy','Epilepsy','Epilepsia','neurological','clinical_diagnosis'),
  e('epistaxis','Epistaxis','Sangramento nasal / epistaxe','lung','symptom_search'),
  e('excessive_vaginal_discharge','Excessive Vaginal Discharge','Corrimento vaginal excessivo','womens','symptom_search'),
  e('fear_fright','Fear & Fright','Medo / susto frequente','mental','symptom_search'),
  e('fibromyalgia','Fibromyalgia','Fibromialgia','pain','clinical_diagnosis'),
  e('frequent_joy','Frequent Joy','Alegria excessiva / frequente','mental','symptom_search'),
  e('frequent_sadness','Frequent Sadness','Tristeza frequente','mental','symptom_search'),
  e('genital_herpes','Genital Herpes','Herpes genital','genitourinary','clinical_diagnosis'),
  e('gonorrhea','Gonorrhoea','Gonorreia','genitourinary','clinical_diagnosis'),
  e('gout','Gout','Gota','pain','clinical_diagnosis'),
  e('halitosis','Halitosis','Halitose','digestive','symptom_search',['mau hálito']),
  e('hashimoto_case','Hashimoto’s Case Study','Tireoidite de Hashimoto','digestive','clinical_diagnosis',['Hashimoto']),
  e('headaches','Headaches','Dor de cabeça / cefaleia','pain','symptom_search'),
  e('hemorrhoids','Hemorrhoids','Hemorroidas','digestive','clinical_diagnosis'),
  e('hernia','Hernia','Hérnia','pain','clinical_diagnosis'),
  e('herpes_zoster','Herpes Zoster','Herpes-zóster','skin','clinical_diagnosis'),
  e('high_bp_case','High Blood Pressure (Case Study)','Pressão alta / hipertensão','cardiovascular','clinical_diagnosis'),
  e('high_cholesterol','High Cholesterol','Colesterol elevado','cardiovascular','clinical_diagnosis'),
  e('urticaria','Hives/Urticaria','Urticária','skin','clinical_diagnosis'),
  e('hpv','Human Papilloma Virus','HPV / papilomavírus humano','genitourinary','clinical_diagnosis',['HPV']),
  e('hypertension','Hypertension','Hipertensão arterial','cardiovascular','clinical_diagnosis'),
  e('hyperthyroidism','Hyperthyroidism','Hipertireoidismo','digestive','clinical_diagnosis'),
  e('hypothyroidism','Hypothyroidism','Hipotireoidismo','digestive','clinical_diagnosis'),
  e('hypoglycemia','Hypoglycemia','Hipoglicemia','digestive','clinical_diagnosis'),
  e('impaired_memory','Impaired Memory','Memória prejudicada','mental','symptom_search'),
  e('impotence','Impotence','Disfunção erétil / impotência','mens','clinical_diagnosis'),
  e('female_infertility','Infertility (women)','Infertilidade feminina','womens','clinical_diagnosis'),
  e('male_infertility','Infertility (men)','Infertilidade masculina','mens','clinical_diagnosis'),
  e('insomnia','Insomnia','Insônia','mental','symptom_search'),
  e('irregular_period','Irregular Period','Menstruação irregular','womens','symptom_search'),
  e('irritability','Irritability','Irritabilidade','mental','symptom_search'),
  e('ibs','Irritable Bowel Syndrome','Síndrome do intestino irritável','digestive','clinical_diagnosis',['SII','IBS']),
  e('lateral_epicondylitis','Lateral Epicondylitis / Tennis Elbow','Epicondilite lateral / cotovelo de tenista','pain','clinical_diagnosis'),
  e('lumbar_disc_herniation','Lumbar Disk Herniation','Hérnia de disco lombar','pain','clinical_diagnosis'),
  e('lyme','Lyme disease','Doença de Lyme','lung','clinical_diagnosis'),
  e('manic_depressive','Manic Depressive','Transtorno maníaco-depressivo','mental','clinical_diagnosis'),
  e('menieres','Menière’s Disease','Doença de Ménière','neurological','clinical_diagnosis'),
  e('menopause','Menopause','Menopausa','womens','context_only'),
  e('menopausal_hysteria','Menopausal Hysteria','Sintomas emocionais da menopausa','mental','context_only'),
  e('metrorrhagia','Metrorrhagia & Metrostaxis','Metrorragia / sangramento uterino irregular','womens','both'),
  e('migraine','Migraine','Enxaqueca','neurological','clinical_diagnosis'),
  e('threatened_miscarriage','Miscarriage (threatened)','Ameaça de abortamento','womens','context_only'),
  e('multiple_sclerosis','Multiple Sclerosis','Esclerose múltipla','neurological','clinical_diagnosis'),
  e('nausea_vomiting','Nausea/Vomiting','Náusea / vômitos','digestive','symptom_search'),
  e('ocd','Obsessive Compulsive Disorder','Transtorno obsessivo-compulsivo','mental','clinical_diagnosis',['TOC']),
  e('osteoarthritis','Osteoarthritis','Osteoartrite / artrose','pain','clinical_diagnosis'),
  e('osteoporosis','Osteoporosis','Osteoporose','pain','clinical_diagnosis'),
  e('worry_overthinking','Overthinking & Worry','Preocupação / pensamento excessivo','mental','symptom_search'),
  e('painful_urination','Painful Urination Syndrome','Síndrome de micção dolorosa','genitourinary','both',['ardor ao urinar']),
  e('parkinsons','Parkinson’s Disease','Doença de Parkinson','neurological','clinical_diagnosis'),
  e('peptic_ulcers','Peptic Ulcers','Úlcera péptica','digestive','clinical_diagnosis'),
  e('early_period','Period (early)','Menstruação adiantada','womens','symptom_search'),
  e('heavy_period','Period (heavy)','Fluxo menstrual intenso','womens','symptom_search'),
  e('prolonged_period','Period (prolonged)','Menstruação prolongada','womens','symptom_search'),
  e('scanty_period','Period (scanty)','Fluxo menstrual escasso','womens','symptom_search'),
  e('pharyngitis','Pharyngitis','Faringite','lung','clinical_diagnosis'),
  e('plum_pit','Plum Pit Syndrome','Síndrome Plum Pit / sensação de bolo na garganta','mental','symptom_search'),
  e('pms_breast_distension','PMS: Breast Distension','TPM: distensão / dor mamária','womens','symptom_search'),
  e('pms_diarrhea','PMS: Diarrhea','TPM: diarreia','womens','symptom_search'),
  e('pms_dizziness','PMS: Dizziness','TPM: tontura','womens','symptom_search'),
  e('pms_edema','PMS: Edema','TPM: edema / inchaço','womens','symptom_search'),
  e('pms_epistaxis','PMS: Epistaxis & Hemoptysis','TPM: epistaxe / hemoptise','womens','symptom_search'),
  e('pms_headaches','PMS: Headaches','TPM: dor de cabeça','womens','symptom_search'),
  e('pms_hormonal_acne','PMS: Hormonal Acne','TPM: acne hormonal','womens','symptom_search'),
  e('pms_mouth_ulcers','PMS: Mouth Ulcers','TPM: aftas / úlceras na boca','womens','symptom_search'),
  e('pneumonia','Pneumonia','Pneumonia','lung','clinical_diagnosis'),
  e('postpartum_abdominal_pain','Postpartum Abdominal Pain','Dor abdominal pós-parto','womens','symptom_search'),
  e('postpartum_depression','Postpartum Depression','Depressão pós-parto','mental','clinical_diagnosis'),
  e('postpartum_lochia','Postpartum Persistent Lochia','Lóquios persistentes pós-parto','womens','symptom_search'),
  e('postpartum_low_milk','Postpartum Scanty Breast Milk','Baixa produção de leite pós-parto','womens','symptom_search'),
  e('postpartum_spontaneous_milk','Postpartum Spontaneous Milk Flow','Fluxo espontâneo de leite pós-parto','womens','symptom_search'),
  e('postpartum_urinary_difficulty','Postpartum Urinary Difficulty','Dificuldade urinária pós-parto','womens','symptom_search'),
  e('pregnancy_contraindications','Pregnancy: Contraindications','Gestação — contraindicações / contexto','womens','context_only'),
  e('morning_sickness','Pregnancy: Morning Sickness','Náuseas e vômitos na gestação','womens','symptom_search'),
  e('pre_menses_mood','Pre-Menses Mood Disorder','Alterações de humor pré-menstruais','mental','symptom_search'),
  e('prostatitis_chronic','Prostatitis (chronic)','Prostatite crônica','mens','clinical_diagnosis'),
  e('pruritus','Pruritus','Prurido / coceira','skin','symptom_search'),
  e('psoriasis','Psoriasis','Psoríase','skin','clinical_diagnosis'),
  e('raynauds','Raynaud’s Disease','Doença / fenômeno de Raynaud','pain','clinical_diagnosis'),
  e('restlessness','Restlessness','Inquietação','mental','symptom_search'),
  e('rib_pain','Rib Pain','Dor nas costelas / hipocôndrio','pain','symptom_search'),
  e('rosacea','Rosacea','Rosácea','skin','clinical_diagnosis'),
  e('running_piglet','Running Piglet','Síndrome Running Piglet','mental','context_only'),
  e('schizophrenia','Schizophrenia','Esquizofrenia','mental','clinical_diagnosis'),
  e('scleroderma','Scleroderma','Esclerodermia','skin','clinical_diagnosis'),
  e('somnolence','Somnolence','Sonolência','mental','symptom_search'),
  e('stomach_pain','Stomach Pain','Dor no estômago','digestive','symptom_search'),
  e('tinnitus','Tinnitus','Zumbido','neurological','symptom_search'),
  e('tonsillitis','Tonsilitis','Amigdalite','lung','clinical_diagnosis'),
  e('tremors','Tremors','Tremores','neurological','symptom_search'),
  e('trigeminal_neuralgia','Trigeminal Neuralgia','Neuralgia do trigêmeo','neurological','clinical_diagnosis'),
  e('tuberculosis','Tuberculosis','Tuberculose','lung','clinical_diagnosis'),
  e('ulcerative_colitis','Ulcerative Colitis','Retocolite ulcerativa','digestive','clinical_diagnosis'),
  e('uterus_prolapse','Uterus Prolapse','Prolapso uterino','womens','clinical_diagnosis'),
  e('vaginal_itching','Vaginal Itching','Coceira vaginal','womens','symptom_search'),
  e('vulvar_sores','Vulvar Sores','Lesões / feridas vulvares','womens','symptom_search'),
  e('warm_diseases_4_levels','Warm Diseases (4 Levels)','Doenças do Calor — 4 Níveis','framework','context_only'),
  e('wheezing','Wheezing','Chiado no peito','lung','symptom_search'),

  // Alphabetical cross-reference entries also present verbatim in the source index.
  e('external_disorders_acute_xref','External disorders (acute)','Transtornos externos agudos','lung','context_only'),
  e('herpes_genital_xref','Herpes (genital)','Herpes genital','genitourinary','clinical_diagnosis'),
  e('joy_frequent_xref','Joy (frequent)','Alegria excessiva / frequente','mental','symptom_search'),
  e('lower_back_pain_xref','Lower Back Pain','Dor lombar','pain','symptom_search',['lombalgia']),
  e('memory_impaired_xref','Memory (impaired)','Memória prejudicada','mental','symptom_search'),
  e('period_delayed_xref','Period (delayed)','Menstruação atrasada','womens','symptom_search'),
  e('period_irregular_xref','Period (irregular)','Menstruação irregular','womens','symptom_search'),
  e('rectum_bladder_prolapse_xref','Rectum & Bladder Prolapse','Prolapso de reto e bexiga','genitourinary','clinical_diagnosis'),
  e('reflux_acute_xref','Reflux (acute)','Refluxo ácido','digestive','both',['azia','refluxo']),
  e('rheumatoid_arthritis_xref','Rheumatoid Arthitis','Artrite reumatoide','pain','clinical_diagnosis'),
  e('rhinitis_allergic_xref','Rhinitis (allergic)','Rinite alérgica','lung','clinical_diagnosis'),
  e('sadness_frequent_xref','Sadness (frequent)','Tristeza frequente','mental','symptom_search'),
  e('sinusitis_chronic_xref','Sinusitis (chronic)','Sinusite crônica','lung','clinical_diagnosis'),
  e('soft_tissue_acute_xref','Soft Tissue Injuries (acute)','Lesões agudas de tecidos moles','pain','clinical_diagnosis'),
  e('tennis_elbow_xref','Tennis Elbow / Lateral Epicondylitis','Cotovelo de tenista / epicondilite lateral','pain','clinical_diagnosis'),
  e('urticaria_hives_xref','Urticaria/Hives','Urticária','skin','clinical_diagnosis'),
  e('vaginal_discharge_xref','Vaginal Discharge (excessive)','Corrimento vaginal excessivo','womens','symptom_search'),
  e('vertigo_dizziness_xref','Vertigo/Dizziness','Vertigem / tontura','neurological','symptom_search'),
  e('vomiting_nausea_xref','Vomiting/Nausea','Vômitos / náusea','digestive','symptom_search'),
  e('worry_overthinking_xref','Worry & Overthinking','Preocupação / pensamento excessivo','mental','symptom_search'),
]

const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()

export function searchBookIndex(q:string, use?:BookIndexUse){
  const x=norm(q)
  return bookIndexEntries.filter(entry=>{
    if(use && entry.use!==use && entry.use!=='both') return false
    if(!x) return true
    const hay=[entry.labelPt,entry.bookLabel,...(entry.aliases||[])].map(norm).join(' ')
    return hay.includes(x)
  }).slice(0,24)
}

export const bookClinicalDiagnosisEntries=bookIndexEntries.filter(e=>e.use==='clinical_diagnosis'||e.use==='both')
export const bookSymptomSearchEntries=bookIndexEntries.filter(e=>e.use==='symptom_search'||e.use==='both')
