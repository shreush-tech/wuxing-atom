import {useClinical} from '../clinical/store'

export function CompoundDiagnosisResult(){
  const {clinical}=useClinical()
  const rows=clinical.compoundDiagnoses||[]
  if(!clinical.interview.canShowResult || !rows.length)return null

  return <section className="compound-diagnoses">
    <p className="result-kicker">Combinações e relações entre sistemas</p>
    {rows.slice(0,6).map(r=>
      <article key={r.id}>
        <strong>{r.label}</strong>
        <span>{r.systems.map(x=>({wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'}[x])).join(' · ')}</span>
      </article>
    )}
  </section>
}
