import { useClinical } from '../clinical/store'
import type { ElementId, ElementVisualState } from '../clinical/types'

export function VisualStateDebug(){
  const {clinical}=useClinical()
  const rows=Object.entries(clinical.elements) as [ElementId,ElementVisualState][]
  return <details className="visual-debug">
    <summary>Estado visual do protótipo</summary>
    <div className="debug-grid">
      {rows.map(([id,v])=><div key={id}>
        <strong>{id}</strong>
        <span>atividade {v.activity.toFixed(2)}</span>
        <span>deficiência {v.deficiency.toFixed(2)}</span>
        <span>excesso {v.excess.toFixed(2)}</span>
        <span>calor {v.heat.toFixed(2)}</span>
        <span>frio {v.cold.toFixed(2)}</span>
        <span>estagnação {v.stagnation.toFixed(2)}</span>
      </div>)}
    </div>
  </details>
}
