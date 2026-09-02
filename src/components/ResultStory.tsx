import { useState } from 'react'
import { MapSignature } from './MapSignature'
import { RootCauseStory } from './RootCauseStory'
import { AmbiguityNotice } from './AmbiguityNotice'
import { resultStory } from '../content/resultStory'
import { useClinical } from '../clinical/store'
import { EvidenceTrace } from './EvidenceTrace'
import { CounterEvidence } from './CounterEvidence'
import { DetailsDisclosure } from './DetailsDisclosure'

export function ResultStory(){
  const {clinical}=useClinical()
  const [details,setDetails]=useState(false)
  if(!clinical.interview.canShowResult)return null
  const s=resultStory(clinical)
  if(!s)return null

  return <section id="result-story" className="result-story">
    <div className="story-kicker">Sua leitura</div>
    <MapSignature/>
    <AmbiguityNotice/>
    <DetailsDisclosure>
      <RootCauseStory/>
      <EvidenceTrace/>
      <CounterEvidence/>
    </DetailsDisclosure>
    
    
    <div className="resolved-marker"><span/><em>As hipóteses convergiram para uma primeira leitura.</em></div>
    <div className="story-grid">
      <div>
        <h2>{s.rel?.headline||s.topLabel.short}</h2>
        <p className="story-lead">{s.rel?.plain||`O conjunto das suas respostas se aproximou de ${s.topLabel.short.toLowerCase()}.`}</p>
      </div>
      <div className="story-state">
        <span>Leitura tradicional</span>
        <strong>{s.confidence}</strong>
      </div>
    </div>

    <div className="why-map">
      <h3>Por que seu mapa ficou assim?</h3>
      <p>Não foi uma resposta isolada. Estes sinais formaram o conjunto que mais sustentou a leitura:</p>
      <div className="evidence-cards">
        {s.evidence.map((e,i)=><article key={`${e.label}-${i}`}>
          <span>{String(i+1).padStart(2,'0')}</span><strong>{e.label}</strong>
        </article>)}
      </div>
    </div>

    {s.runnerLabel&&<div className="runner-up">
      <span>Uma possibilidade que permaneceu por perto</span>
      <strong>{s.runnerLabel.short}</strong>
      <p>Ela continua visível para evitar uma conclusão artificialmente fechada.</p>
    </div>}

    <button className="traditional-toggle" onClick={()=>setDetails(v=>!v)}>
      {details?'Ocultar interpretação tradicional':'Ver interpretação tradicional'}
    </button>

    {details&&<div className="traditional-layer">
      <div><span>Padrão principal</span><strong>{s.topLabel.traditional}</strong></div>
      {s.runnerLabel&&<div><span>Alternativa atual</span><strong>{s.runnerLabel.traditional}</strong></div>}
      {clinical.relationship&&<div><span>Relação Wu Xing</span><strong>{clinical.relationship.label} · {clinical.relationship.title}</strong></div>}
      <p>Esta é uma leitura educativa baseada nas respostas fornecidas. Uma avaliação clínica pode confirmar, modificar ou descartar essas hipóteses.</p>
    </div>}
  </section>
}