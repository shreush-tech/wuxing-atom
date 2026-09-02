import { elementFocusCopy,type FocusElement } from '../content/elementFocusCopy'

export function ElementFocusCard({element,onClose}:{element:FocusElement|null,onClose:()=>void}){
  if(!element)return null
  const x=elementFocusCopy[element]
  const e=x.education
  return <aside className="element-focus-card element-focus-rich" aria-live="polite">
    <button className="focus-close" type="button" onClick={onClose} aria-label="Voltar ao mapa">×</button>
    <div className="focus-glyph">{x.glyph}</div>
    <div>
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
    </div>
  </aside>
}
