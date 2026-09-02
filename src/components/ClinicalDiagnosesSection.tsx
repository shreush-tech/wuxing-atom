import {useMemo,useState} from 'react'
import {clinicalDiagnoses,searchClinicalDiagnoses,type ClinicalDiagnosisCategory} from '../clinical/clinicalDiagnoses'
import {useClinical} from '../clinical/store'

const systems:{id:ClinicalDiagnosisCategory;label:string}[]=[
 ['dor_e_musculoesqueletico','Dor / músculo-esquelético'],['digestivo','Digestivo'],['cardiometabolico','Cardiovascular / metabólico'],
 ['respiratorio','Respiratório'],['neurologico','Neurológico'],['urogenital','Urinário / genital'],['ginecologico','Ginecológico'],
 ['endocrino','Endócrino'],['dermatologico','Pele'],['saude_mental','Saúde mental']
].map(([id,label])=>({id:id as ClinicalDiagnosisCategory,label}))

export function ClinicalDiagnosesSection(){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[system,setSystem]=useState<ClinicalDiagnosisCategory|null>(null)
 const {clinicalDiagnosisIds,toggleClinicalDiagnosis}=useClinical()
 const results=useMemo(()=>query.trim()?searchClinicalDiagnoses(query):(system?clinicalDiagnoses.filter(d=>d.category===system).slice(0,24):clinicalDiagnoses.slice(0,12)),[query,system])
 return <section className="clinical-diagnoses gilded-box">
  <button type="button" className="clinical-diagnoses__toggle" onClick={()=>setOpen(v=>!v)}><span><strong>Diagnósticos clínicos informados</strong><small>{clinicalDiagnosisIds.length?`${clinicalDiagnosisIds.length} informado${clinicalDiagnosisIds.length>1?'s':''}`:'Opcional · condições já diagnosticadas por profissional de saúde'}</small></span><span aria-hidden>{open?'−':'+'}</span></button>
  {open&&<div className="clinical-diagnoses__body">
   <label htmlFor="clinical-diagnosis-search">Buscar diagnóstico ou navegar por sistema</label>
   <input id="clinical-diagnosis-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ex.: endometriose, enxaqueca, fibromialgia…"/>
   <div className="diagnosis-systems">{systems.map(x=><button key={x.id} className={system===x.id?'active':''} onClick={()=>{setSystem(system===x.id?null:x.id);setQuery('')}}>{x.label}</button>)}</div>
   <div className="clinical-diagnoses__results">{results.map(d=><button type="button" key={d.id} className={clinicalDiagnosisIds.includes(d.id)?'diagnosis-chip selected':'diagnosis-chip'} aria-pressed={clinicalDiagnosisIds.includes(d.id)} onClick={()=>toggleClinicalDiagnosis(d.id)}>{d.label}</button>)}</div>
   {!results.length&&<p className="clinical-diagnoses__note">Esse termo ainda não está ligado ao banco clínico de referência. Você pode continuar a constelação pelos sinais e sintomas sem forçar uma associação.</p>}
   <p className="clinical-diagnoses__note">O diagnóstico clínico informado contextualiza a entrevista, mas nunca vira automaticamente um desequilíbrio da Medicina Chinesa.</p>
  </div>}
 </section>
}
