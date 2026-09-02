import {useMemo,useState} from 'react'
import {searchClinicalDiagnoses} from '../clinical/clinicalDiagnoses'
import {useClinical} from '../clinical/store'

export function ClinicalDiagnosesSection(){
 const [open,setOpen]=useState(false),[query,setQuery]=useState('')
 const {clinicalDiagnosisIds,toggleClinicalDiagnosis}=useClinical()
 const results=useMemo(()=>searchClinicalDiagnoses(query),[query])

 return <section className="clinical-diagnoses">
  <button type="button" className="clinical-diagnoses__toggle" onClick={()=>setOpen(v=>!v)}>
   <span>
    <strong>Diagnósticos clínicos</strong>
    <small>{clinicalDiagnosisIds.length
      ? `${clinicalDiagnosisIds.length} informado${clinicalDiagnosisIds.length>1?'s':''}`
      : 'Opcional · condições já diagnosticadas por um profissional de saúde'}</small>
   </span>
   <span aria-hidden>{open?'−':'+'}</span>
  </button>

  {open&&<div className="clinical-diagnoses__body">
   <label htmlFor="clinical-diagnosis-search">Buscar diagnóstico</label>
   <input id="clinical-diagnosis-search" value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Ex.: endometriose, enxaqueca, fibromialgia…"/>
   <div className="clinical-diagnoses__results">
    {results.map(d=><button type="button" key={d.id}
      className={clinicalDiagnosisIds.includes(d.id)?'diagnosis-chip selected':'diagnosis-chip'}
      aria-pressed={clinicalDiagnosisIds.includes(d.id)}
      onClick={()=>toggleClinicalDiagnosis(d.id)}>{d.label}</button>)}
   </div>
   <p className="clinical-diagnoses__note">Eles ajudam a contextualizar as perguntas, mas não determinam sozinhos um elemento ou desequilíbrio.</p>
  </div>}
 </section>
}
