import { useClinical } from '../clinical/store'
import { buildEvidenceTrace } from '../content/evidenceTrace'
import { symptoms } from '../clinical/symptoms'

function symptomLabel(id:string){
  const s=(symptoms as any[]).find(x=>x.id===id)
  return s?.label || s?.name || id.replaceAll('_',' ')
}

export function EvidenceTrace(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null
  const traces=buildEvidenceTrace(clinical).filter(t=>t.items.length)
  if(!traces.length)return null

  return <section className="evidence-trace">
    <div className="story-kicker">Por que essa leitura apareceu</div>
    <h3>Os sinais que mais pesaram na diferenciação</h3>
    <p className="evidence-intro">Em vez de mostrar uma pontuação abstrata, esta camada liga a interpretação às respostas que efetivamente participaram do raciocínio.</p>
    <div className="evidence-patterns">
      {traces.map((trace,i)=><article key={trace.patternId}>
        <header><span>{i===0?'Hipótese principal':'Hipótese associada'}</span><strong>{trace.label}</strong></header>
        <div className="evidence-items">
          {trace.items.map(item=><div key={`${trace.patternId}-${item.symptomId}`} className={item.direction}>
            <i/>
            <span>{symptomLabel(item.symptomId)}</span>
            <small>{item.direction==='supports'?'favoreceu esta leitura':'puxou contra esta leitura'}</small>
          </div>)}
        </div>
      </article>)}
    </div>
    <small className="evidence-foot">A intensidade interna é usada apenas para ordenar hipóteses; ela não é apresentada como probabilidade médica.</small>
  </section>
}
