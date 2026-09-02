import { elementFocusCopy,type FocusElement } from '../content/elementFocusCopy'

export function ElementFocusCard({element,onClose}:{element:FocusElement|null,onClose:()=>void}){
  if(!element)return null
  const x=elementFocusCopy[element]
  const e=x.education
  return <div className="scene-info-backdrop" role="presentation" onPointerDown={onClose}>
    <aside className="element-focus-card element-focus-rich scene-info-card" aria-live="polite" onPointerDown={ev=>ev.stopPropagation()}>
      <button className="focus-close" type="button" onClick={onClose} aria-label="Fechar informação">×</button>
      <div className="focus-glyph">{x.glyph}</div>
      <div>
        <div className="scene-info-kicker">Cinco Movimentos</div>
        <h3>{x.name}</h3>
        <p className="focus-organs">{x.organs}</p>
        <p className="focus-headline">{e.headline}</p>
        <p>{e.body}</p>
        <div className="focus-theme-row">{e.themes.slice(0,4).map(v=><span key={v}>{v}</span>)}</div>
        <div className="spirit-mini">
          <strong>{e.spirit.name} · {e.spirit.label}</strong>
          <span>Em equilíbrio: {e.spirit.balanced}.</span>
        </div>
        <details className="focus-deep">
          <summary>Aprofundar</summary>
          <ul>{e.advanced.map(v=><li key={v}>{v}</li>)}</ul>
        </details>
        <small className="scene-info-dismiss">Clique fora para fechar</small>
      </div>
    </aside>
  </div>
}
