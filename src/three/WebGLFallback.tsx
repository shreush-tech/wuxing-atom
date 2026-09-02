import { elementMeta } from '../content/elements'
import type { ElementId } from '../clinical/types'

const ids:ElementId[]=['wood','fire','earth','metal','water']

export function WebGLFallback(){
  return <div className="webgl-fallback" role="img" aria-label="Mapa dos Cinco Elementos em versão simplificada">
    <div className="fallback-core">氣</div>
    {ids.map((id,i)=><div className={`fallback-element f-${i}`} key={id} style={{borderColor:elementMeta[id].color}}>
      <span>{elementMeta[id].char}</span><small>{elementMeta[id].name}</small>
    </div>)}
    <p>Seu dispositivo está usando a versão simplificada do mapa. O questionário e a leitura educativa continuam disponíveis.</p>
  </div>
}
