import {clinicalDiagnoses} from '../clinical/clinicalDiagnoses'
import {useClinical} from '../clinical/store'

export function ClinicalDiagnosesConsidered(){
 const {clinicalDiagnosisIds}=useClinical()
 if(!clinicalDiagnosisIds.length)return null
 const labels=clinicalDiagnosisIds.map(id=>clinicalDiagnoses.find(d=>d.id===id)?.label).filter(Boolean) as string[]
 return <div className="diagnoses-considered">
  <span>Diagnósticos clínicos considerados</span>
  <div>{labels.map(label=><span key={label} className="context-chip">{label}</span>)}</div>
  <small>Usados como contexto da anamnese — não como diagnóstico automático da Medicina Chinesa.</small>
 </div>
}
