import { useClinical } from '../clinical/store'
import { patternElementMap } from '../content/patternElementMap'
import type { ElementId } from '../clinical/types'

const elementPt={wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'}

export function MapSignature(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null
  const mapped=clinical.patterns.filter(p=>p.raw>0).slice(0,3).map(p=>patternElementMap[p.id]).filter(Boolean) as ElementId[]
  const active=Array.from(new Set<ElementId>(mapped))
  return <div className="map-signature">
    <span>Composição do seu mapa</span>
    <div className="signature-elements">
      {active.map((e,i)=><span key={e}><b>{elementPt[e]}</b>{i<active.length-1&&<i>·</i>}</span>)}
    </div>
    <p>Esta composição resume quais elementos ganharam relevância nesta leitura. Ela não define um “tipo de pessoa” e pode mudar conforme o conjunto de sinais muda.</p>
  </div>
}
