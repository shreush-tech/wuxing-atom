import { useClinical } from '../clinical/store'
import { buildRelationshipEmergence } from '../content/relationshipEmergence'

const stageText={
  absent:'',
  hint:'Uma relação começou a aparecer, mas ainda é cedo para destacá-la.',
  forming:'A combinação das suas respostas está formando uma relação entre elementos.',
  supported:'Essa relação ganhou sustentação dentro do seu mapa.',
  dominant:'Esta interação participa da sua primeira leitura.'
}

export function RelationshipEmergenceNote(){
  const {clinical}=useClinical()
  const e=buildRelationshipEmergence(clinical)
  if(e.stage==='absent')return null
  return <div className={`relationship-emergence-note ${e.stage}`}>
    <span>Interação no mapa</span>
    <div><strong>{e.label}</strong><p>{stageText[e.stage]}</p></div>
    <small>{e.title}</small>
  </div>
}
