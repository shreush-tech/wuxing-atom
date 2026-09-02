import { bookClinicalDiagnosisEntries } from '../content/bookIndex'

export type ClinicalDiagnosisCategory =
  | 'dor_e_musculoesqueletico' | 'digestivo' | 'ginecologico'
  | 'neurologico' | 'respiratorio' | 'cardiometabolico'
  | 'endocrino' | 'urogenital' | 'dermatologico' | 'saude_mental' | 'outros'

export type ClinicalDiagnosisDef={
  id:string; label:string; aliases:string[]; category:ClinicalDiagnosisCategory;
  source:'uploaded_reference_book'|'general_clinical_vocabulary'; sourceScope:'index_or_named_disorder_section'|'common_diagnosis_search_only'
}

const categoryMap:Record<string,ClinicalDiagnosisCategory>={
  lung:'respiratorio',digestive:'digestivo',neurological:'neurologico',cardiovascular:'cardiometabolico',mental:'saude_mental',
  pain:'dor_e_musculoesqueletico',womens:'ginecologico',mens:'urogenital',genitourinary:'urogenital',skin:'dermatologico',
  cancer_support:'outros',framework:'outros',other:'outros'
}

const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
const seen=new Set<string>()
const bookClinicalDiagnoses:ClinicalDiagnosisDef[]=bookClinicalDiagnosisEntries.flatMap(entry=>{
  const key=norm(entry.labelPt)
  if(seen.has(key))return []
  seen.add(key)
  return [{
    id:entry.id,
    label:entry.labelPt,
    aliases:[entry.bookLabel,...(entry.aliases||[])],
    category:categoryMap[entry.category]||'outros',
    source:'uploaded_reference_book' as const,
    sourceScope:'index_or_named_disorder_section' as const
  }]
})


// Common biomedical vocabulary expands navigation only. These entries carry zero direct
// TCM/element weight and do not invent a book-supported crosswalk when none exists.
const commonClinicalDiagnoses:ClinicalDiagnosisDef[]=[
  ['hypertension','Hipertensão arterial',['pressão alta'],'cardiometabolico'],
  ['type_2_diabetes','Diabetes mellitus tipo 2',['diabetes tipo 2'],'endocrino'],
  ['hypothyroidism','Hipotireoidismo',['tireoide baixa'],'endocrino'],
  ['asthma','Asma',['bronquite asmática'],'respiratorio'],
  ['copd','DPOC',['doença pulmonar obstrutiva crônica'],'respiratorio'],
  ['gerd_common','Doença do refluxo gastroesofágico',['DRGE','refluxo gastroesofágico'],'digestivo'],
  ['osteoarthritis','Osteoartrose',['artrose'],'dor_e_musculoesqueletico'],
  ['knee_osteoarthritis','Artrose do joelho',['gonartrose'],'dor_e_musculoesqueletico'],
  ['rotator_cuff','Síndrome do manguito rotador',['tendinopatia do ombro'],'dor_e_musculoesqueletico'],
  ['lateral_epicondylitis','Epicondilite lateral',['cotovelo de tenista'],'dor_e_musculoesqueletico'],
  ['medial_epicondylitis','Epicondilite medial',['cotovelo de golfista'],'dor_e_musculoesqueletico'],
  ['uti','Infecção urinária',['ITU','cistite'],'urogenital'],
  ['bph','Hiperplasia prostática benigna',['HPB','próstata aumentada'],'urogenital'],
  ['pcos','Síndrome dos ovários policísticos',['SOP'],'ginecologico'],
  ['endometriosis_common','Endometriose',['endometriose'],'ginecologico'],
  ['anxiety_disorder','Transtorno de ansiedade',['ansiedade'],'saude_mental'],
  ['depressive_disorder','Transtorno depressivo',['depressão'],'saude_mental'],
  ['insomnia_clinical','Insônia',['transtorno de insônia'],'saude_mental'],
  ['migraine_common','Enxaqueca',['migrânea'],'neurologico'],
  ['peripheral_neuropathy','Neuropatia periférica',['polineuropatia'],'neurologico']
].map(([id,label,aliases,category])=>({id:id as string,label:label as string,aliases:aliases as string[],category:category as ClinicalDiagnosisCategory,source:'general_clinical_vocabulary' as const,sourceScope:'common_diagnosis_search_only' as const}))

const existing=new Set(bookClinicalDiagnoses.map(d=>norm(d.label)))
export const clinicalDiagnoses:ClinicalDiagnosisDef[]=[...bookClinicalDiagnoses,...commonClinicalDiagnoses.filter(d=>!existing.has(norm(d.label)))]

export function searchClinicalDiagnoses(q:string){
 const x=norm(q); if(!x)return clinicalDiagnoses.slice(0,12)
 return clinicalDiagnoses.filter(d=>norm(d.label).includes(x)||d.aliases.some(a=>norm(a).includes(x))).slice(0,18)
}

export const clinicalDiagnosisPolicy={
 directElementWeight:0,
 directImbalanceWeight:0,
 mayPrioritizeDifferentialQuestions:true,
 requiresCurrentEvidenceForChineseMedicineImbalance:true,
 mayRemainUncorrelated:true
} as const
