import { useClinical } from '../clinical/store'
import { buildCounterEvidence } from '../content/counterEvidence'

const human=(x:string)=>x.replaceAll('_',' ')

export function CounterEvidence(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null
  const views=buildCounterEvidence(clinical)
  if(!views.length)return null
  return <section className="counter-evidence">
    <div className="story-kicker">O que impede uma conclusão rígida</div>
    {views.map(v=><article key={v.label}>
      <strong>{v.label}</strong>
      {v.contradictions.length>0&&<div><span>Sinais que enfraquecem</span><p>{v.contradictions.map(human).join(' · ')}</p></div>}
      {v.missing.length>0&&<div><span>Sinais ainda não sustentados</span><p>{v.missing.map(human).join(' · ')}</p></div>}
    </article>)}
  </section>
}
