import {useEffect,useState} from 'react'
import {yinYangEducation} from '../content/theoryEducation'

export function YinYangInfoPanel(){
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const handler=()=>setOpen(true)
    window.addEventListener('wuxing-core-explore',handler)
    return ()=>window.removeEventListener('wuxing-core-explore',handler)
  },[])
  if(!open)return null
  return <aside className="yin-yang-panel" aria-live="polite" aria-label="Yin e Yang">
    <button className="focus-close" type="button" onClick={()=>setOpen(false)} aria-label="Fechar Yin e Yang">×</button>
    <div className="yy-kicker">Núcleo do mapa</div>
    <h3>{yinYangEducation.title}</h3>
    <p className="yy-headline">{yinYangEducation.headline}</p>
    <p>{yinYangEducation.short}</p>
    <div className="yy-dual">
      <div><strong>Yin</strong><span>interior · nutrição · substância · resfriamento · repouso</span></div>
      <div><strong>Yang</strong><span>exterior · função · transformação · aquecimento · atividade</span></div>
    </div>
    <ul className="yy-principles">{yinYangEducation.principles.map(v=><li key={v}>{v}</li>)}</ul>
    <details>
      <summary>Entender calor por excesso e por deficiência</summary>
      {yinYangEducation.clinicalTeaching.map(v=><p key={v}>{v}</p>)}
    </details>
  </aside>
}
