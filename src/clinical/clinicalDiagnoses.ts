import { bookClinicalDiagnosisEntries } from '../content/bookIndex'

export type ClinicalDiagnosisCategory =
  | 'dor_e_musculoesqueletico' | 'digestivo' | 'ginecologico'
  | 'neurologico' | 'respiratorio' | 'cardiometabolico'
  | 'endocrino' | 'urogenital' | 'dermatologico' | 'saude_mental' | 'outros'

export type ClinicalDiagnosisDef={
  id:string; label:string; aliases:string[]; category:ClinicalDiagnosisCategory;
  source:'uploaded_reference_book'; sourceScope:'index_or_named_disorder_section'
}

const categoryMap:Record<string,ClinicalDiagnosisCategory>={
  lung:'respiratorio',digestive:'digestivo',neurological:'neurologico',cardiovascular:'cardiometabolico',mental:'saude_mental',
  pain:'dor_e_musculoesqueletico',womens:'ginecologico',mens:'urogenital',genitourinary:'urogenital',skin:'dermatologico',
  cancer_support:'outros',framework:'outros',other:'outros'
}

const norm=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
const seen=new Set<string>()
export const clinicalDiagnoses:ClinicalDiagnosisDef[]=bookClinicalDiagnosisEntries.flatMap(entry=>{
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
