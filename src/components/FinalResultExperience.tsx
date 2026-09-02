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
import {CompoundDiagnosisResult} from './CompoundDiagnosisResult'
import {ContextualPatternResult} from './ContextualPatternResult'
import {ClinicalDiagnosesConsidered} from './ClinicalDiagnosesConsidered'

export function FinalResultExperience(){
  const {clinical}=useClinical()
  const r=resultArchitecture(clinical)
  const [open,setOpen]=useState(false)
  if(!r.hasResult)return null

  return <section id="resultado" className="final-result">
    <header className="result-first-read">
      <p className="result-kicker">Leitura dos seus desequilíbrios segundo a Medicina Chinesa</p>
      <h2>Seu mapa</h2>
      <p className="result-confidence">{r.confidenceLabel}</p>
    </header>

    <ClinicalDiagnosesConsidered/>

    <div className="result-pattern-pair">
      <div>
        <span>desequilíbrio em destaque</span>
        <strong>{patternLabel(r.primary)}</strong>
      </div>
      {r.secondary&&<div>
        <span>desequilíbrio associado</span>
        <strong>{patternLabel(r.secondary)}</strong>
      </div>}
    </div>

    <MultiSystemResult/>
    <CompoundDiagnosisResult/>
    <ContextualPatternResult/>

    <RootCauseStory/>

    <button type="button" className="result-details-trigger" onClick={()=>setOpen(v=>!v)}>
      {open?'Ocultar detalhes':'Entender por que apareceu'}
    </button>

    {open&&<div className="result-evidence-layer">
      <EvidenceTrace/>
      <CounterEvidence/>
    </div>}

    <div className="result-practical-layer">
      <PracticalAftercare/>
    </div>

    <div className="result-contact-layer">
      <ConsultationHandoff/>
    </div>
  </section>
}
