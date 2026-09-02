import { useClinical } from '../clinical/store'
import { patternLabels } from '../content/resultLabels'

export function AmbiguityNotice(){
  const {clinical}=useClinical()
  const rel=clinical.patternRelationships?.[0]
  const isGeneralAmbiguous=clinical.interview.readiness==='ambiguous'

  if(!rel&&!isGeneralAmbiguous)return null

  if(rel){
    return <div className="ambiguity-notice">
      <div className="story-kicker">
        {rel.kind==='root_branch'?'Padrões relacionados':rel.kind==='coexisting'?'Padrões coexistentes':'Leitura em refinamento'}
      </div>
      <h3>{rel.title}</h3>
      <p>{rel.explanation}</p>
      {!!rel.discriminators.length&&<small>
        As próximas perguntas ajudam a entender quanto cada componente participa do quadro.
      </small>}
    </div>
  }

  const [a,b]=clinical.patterns.filter(p=>p.raw>0).slice(0,2)
  if(!a||!b)return null
  return <div className="ambiguity-notice">
    <div className="story-kicker">Mapa multifatorial</div>
    <h3>Mais de um padrão pode estar presente.</h3>
    <div><span>{patternLabels[a.id]?.short||a.label}</span><i>+</i><span>{patternLabels[b.id]?.short||b.label}</span></div>
    <p>O sistema parte dos sintomas de cada padrão e mantém simultaneamente os componentes que receberam suporte, em vez de forçar uma escolha única.</p>
  </div>
}
