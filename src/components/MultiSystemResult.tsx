import {useClinical} from '../clinical/store'
import {patterns} from '../clinical/patterns'

const elementLabel={
  wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'
} as const

export function MultiSystemResult(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult || !clinical.systemDiagnoses.length)return null

  return <section className="multi-system-result">
    <p className="result-kicker">Desequilíbrios que apareceram em sistemas diferentes</p>
    <div className="system-diagnosis-grid">
      {clinical.systemDiagnoses.map(system=>
        <article key={system.element}>
          <span>{elementLabel[system.element]}</span>
          {system.patterns.map(p=>{
            const def=patterns.find(x=>x.id===p.id)
            return <strong key={p.id}>{def?.label||p.id}</strong>
          })}
        </article>
      )}
    </div>
    <p className="multi-system-note">
      Mais de um padrão pode coexistir. A leitura mostra apenas padrões sustentados pelo conjunto das suas respostas.
    </p>
  </section>
}
