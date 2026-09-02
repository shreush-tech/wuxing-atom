import { useClinical } from '../clinical/store'

export function MapReadiness(){
  const {clinical}=useClinical()
  const i=clinical.interview
  const top=clinical.patterns[0]
  const second=clinical.patterns[1]

  return <div className={`map-readiness ${i.readiness}`}>
    <div className="readiness-bar"><span style={{width:`${Math.round(i.informationLevel*100)}%`}}/></div>
    <strong>{i.rationale}</strong>
    {i.readiness==='ambiguous' && top && second && <p>
      Neste momento, “{top.id}” e “{second.id}” continuam relativamente próximos. O sistema não vai escolher um deles apenas para fechar o mapa.
    </p>}
    {i.readiness==='refine' && <p>Você já pode continuar respondendo para aumentar a separação entre as alternativas.</p>}
    {i.readiness==='ready' && <p>Já há informação suficiente para mostrar uma primeira leitura, mantendo alternativas disponíveis.</p>}
  </div>
}
