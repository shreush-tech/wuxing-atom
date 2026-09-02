import {useState} from 'react'
import {useClinical} from '../clinical/store'
import {resultArchitecture} from '../content/resultArchitecture'
import {patternLabel} from '../content/patternLabels'
import {EvidenceTrace} from './EvidenceTrace'
import {CounterEvidence} from './CounterEvidence'
import {RootCauseStory} from './RootCauseStory'
import {PracticalAftercare} from './PracticalAftercare'
import {ConsultationHandoff} from './ConsultationHandoff'
import {MultiSystemResult} from './MultiSystemResult'
import {ContextualPatternResult} from './ContextualPatternResult'
import {ClinicalDiagnosesConsidered} from './ClinicalDiagnosesConsidered'
import {OrganicBalanceMiniature} from './OrganicBalanceMiniature'

export function FinalResultExperience(){
  const {clinical}=useClinical(),r=resultArchitecture(clinical),[open,setOpen]=useState(false)
  if(!r.hasResult)return null
  const back=()=>document.querySelector('.app')?.scrollIntoView({behavior:'smooth',block:'start'})
  return <section id="resultado" className="final-result parchment-result">
    <button type="button" className="result-back" onClick={back}>← Voltar à constelação</button>
    <div className="parchment-grid"><div>
      <header className="result-first-read"><p className="result-kicker">Leitura dos seus desequilíbrios segundo a Medicina Chinesa</p><h2>Seu Equilíbrio Orgânico</h2><p className="result-confidence">{r.confidenceLabel}</p></header>
      <ClinicalDiagnosesConsidered/>
      <div className="result-pattern-pair"><div><span>desequilíbrio em destaque</span><strong>{patternLabel(r.primary)}</strong></div>{r.secondary&&<div><span>outro desequilíbrio sustentado</span><strong>{patternLabel(r.secondary)}</strong></div>}</div>
    </div><OrganicBalanceMiniature/></div>
    <MultiSystemResult/><ContextualPatternResult/><RootCauseStory/>
    <p className="atomic-note">Cada desequilíbrio é apresentado de forma independente. Relações fisiopatológicas podem ajudar a explicar coexistências, mas não criam um novo diagnóstico combinado.</p>
    <button type="button" className="result-details-trigger" onClick={()=>setOpen(v=>!v)}>{open?'Ocultar detalhes':'Entender por que apareceu'}</button>
    {open&&<div className="result-evidence-layer"><EvidenceTrace/><CounterEvidence/></div>}
    <div className="result-practical-layer"><PracticalAftercare/></div>
    <div className="result-contact-layer"><ConsultationHandoff/></div>
  </section>
}
