import { useClinical } from '../clinical/store'

const copy={
  starting:{title:'Começando pelo que você sente',body:'Escolha as queixas que mais chamam sua atenção. O mapa ainda está aberto.'},
  forming:{title:'Seu equilíbrio orgânico está ganhando forma',body:'Algumas combinações começaram a aparecer. As próximas perguntas procuram separar possibilidades parecidas.'},
  refine:{title:'Há uma direção, mas ainda vale refinar',body:'O sistema já encontrou uma hipótese mais forte e continua procurando sinais que possam confirmá-la ou enfraquecê-la.'},
  ready:{title:'Já temos uma primeira leitura',body:'Há sinais suficientes para mostrar o mapa sem transformar a leitura em uma certeza artificial.'},
  ambiguous:{title:'Seu equilíbrio orgânico continua aberto',body:'Duas leituras permanecem próximas. Em vez de forçar uma resposta, o sistema preserva essa ambiguidade.'}
}

export function DiagnosticJourney(){
  const {clinical}=useClinical()
  const c=copy[clinical.interview.readiness]
  return <div className={`diagnostic-journey ${clinical.interview.readiness}`}>
    <div className="journey-orbit" aria-hidden="true"><i/><i/><i/></div>
    <div>
      <span>Leitura em andamento</span>
      <strong>{c.title}</strong>
      <p>{c.body}</p>
    </div>
  </div>
}
