import {relationshipFocusCopy} from '../content/relationshipFocusCopy'
import {elementFocusCopy} from '../content/elementFocusCopy'
import type { RelationshipFocus } from './FocusContext'

export function RelationshipFocusCard({relationship,onClose}:{relationship:RelationshipFocus|null,onClose:()=>void}){
  if(!relationship)return null
  const x=relationshipFocusCopy[relationship.kind]
  const s=elementFocusCopy[relationship.source]
  const t=elementFocusCopy[relationship.target]

  return <aside className="relationship-focus-card" aria-live="polite">
    <button className="focus-close" type="button" onClick={onClose} aria-label="Voltar ao mapa">×</button>
    <div className="relationship-glyph">{x.glyph}</div>
    <div>
      <p className="relationship-pair">{s.glyph} {s.name} → {t.glyph} {t.name}</p>
      <h3>{x.name}</h3>
      <p>{x.phrase}</p>
    </div>
  </aside>
}
