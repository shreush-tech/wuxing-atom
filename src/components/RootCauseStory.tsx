import { useClinical } from '../clinical/store'
import { buildRootCauseNarrative } from '../content/rootCauseNarrative'

export function RootCauseStory(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null
  const n=buildRootCauseNarrative(clinical)
  return <section className="root-cause-story">
    <div className="story-kicker">Organizando a leitura</div>
    <h3>{n.headline}</h3>
    {n.primary&&<div className="root-flow">
      <span>{n.primary}</span>
      {n.companion&&<><i>→</i><span>{n.companion}</span></>}
    </div>}
    <p>{n.body}</p>
    <small>“Raiz” aqui é uma organização da leitura segundo a Medicina Chinesa, não uma afirmação de causa biomédica.</small>
  </section>
}
