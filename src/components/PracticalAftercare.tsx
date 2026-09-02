import {useState} from 'react'
import { buildPersonalNarrative } from '../content/personalNarrative'
import { practicalRecommendations } from '../content/practicalRecommendations'
import { acupointAtlas } from '../content/acupointAtlas'
import { AcupointDiagram } from './AcupointDiagram'
import { useClinical } from '../clinical/store'
import {useWorkspace} from '../workspace/WorkspaceProvider'

export function PracticalAftercare(){
  const {clinical}=useClinical(),{state}=useWorkspace(),[open,setOpen]=useState(false),[tab,setTab]=useState<'diet'|'pressure'|'acu'>('diet')
  if(!clinical.interview.canShowResult)return null
  const narrative=buildPersonalNarrative(clinical);if(!narrative)return null
  const rec=practicalRecommendations[narrative.topId],pressurePoints=(rec?.acupressurePoints||[]).map(id=>acupointAtlas[id]).filter(Boolean)
  const professional=state.role==='physician'||state.role==='student'
  return <section className="aftercare treatment-gateway">
    <button className="treatment-open" onClick={()=>setOpen(v=>!v)}><span>Tratamentos relacionados</span><strong>{open?'Fechar':'Explorar →'}</strong></button>
    {open&&<><div className="treatment-tabs"><button className={tab==='diet'?'active':''} onClick={()=>setTab('diet')}>Dietoterapia</button><button className={tab==='pressure'?'active':''} onClick={()=>setTab('pressure')}>Acupressão / Tuiná</button><button className={tab==='acu'?'active':''} onClick={()=>setTab('acu')}>Acupuntura</button></div>
    {tab==='diet'&&rec?.diet&&<div className="aftercare-card"><h3>Dietoterapia tradicional</h3><p>{rec.diet.title}</p><div className="food-columns"><div><strong>Priorizar</strong><p>{rec.diet.prefer.join(' · ')}</p></div><div><strong>Reduzir</strong><p>{rec.diet.reduce.join(' · ')}</p></div></div><p>{rec.diet.habits.join(' ')}</p></div>}
    {tab==='pressure'&&<div className="aftercare-card"><h3>Pontos de acupuntura e acupressão</h3><p>Para experimentar em casa, mostramos apenas estímulo manual confortável em acupontos. Não há instrução de autoagulhamento.</p><div className="massage-grid">{pressurePoints.map(p=><article key={p.id}><AcupointDiagram point={p}/><div className="point-copy"><strong>{p.id} · {p.name} <span className="hanzi">{p.chinese}</span></strong><p>{p.layLocation}</p></div></article>)}</div></div>}
    {tab==='acu'&&<div className="aftercare-card acupuncture">{professional&&rec?<><h3>Plano profissional relacionado ao padrão</h3><p>{rec.principle} A combinação final deve ser revista no contexto clínico completo.</p><div className="acu-points">{rec.acupoints.map(p=><span key={p}>{p}</span>)}</div></>:<><div className="premium-seal">REUSHTECH · PLANO AVANÇADO</div><h3>Tratamento completo para profissionais</h3><p>A camada avançada reúne os acupontos relacionados ao padrão e o raciocínio terapêutico. A versão pública não fornece técnica invasiva nem autoagulhamento.</p><button type="button" className="premium-cta">Conhecer plano profissional</button></>}</div>}</>}
  </section>
}
