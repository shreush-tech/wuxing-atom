import {useEffect,useState} from 'react'
import {knowledgeTopics,type KnowledgeTopicId} from '../content/knowledgeTopics'

const ids:KnowledgeTopicId[]=['wuxing','wood','fire','earth','metal','water','yin_yang','qi','tao']

export function KnowledgePortal(){
  const [open,setOpen]=useState(false)
  const [topic,setTopic]=useState<KnowledgeTopicId>('wuxing')
  const item=knowledgeTopics[topic]
  useEffect(()=>{const openPortal=()=>setOpen(true);window.addEventListener('reush-open-knowledge',openPortal);return()=>window.removeEventListener('reush-open-knowledge',openPortal)},[])
  return <>
    <button className="knowledge-star" aria-label="Abrir conhecimento" onClick={()=>setOpen(true)}>
      <span>✦</span><small>Conhecimento</small>
    </button>
    {open&&<div className="knowledge-backdrop" onClick={()=>setOpen(false)}>
      <aside className="knowledge-panel" onClick={e=>e.stopPropagation()}>
        <header><div><small>Explorar</small><h2>{item.title}</h2>{item.chinese&&<span>{item.chinese}</span>}</div><button aria-label="Fechar" onClick={()=>setOpen(false)}>×</button></header>
        <nav>{ids.map(id=><button className={topic===id?'active':''} key={id} onClick={()=>setTopic(id)}>{knowledgeTopics[id].title}</button>)}</nav>
        <div className="knowledge-scroll">
          <p className="knowledge-subtitle">{item.subtitle}</p><p className="knowledge-intro">{item.intro}</p>
          <div className="knowledge-facts">{item.facts.map(f=><div key={f.label}><span>{f.label}</span><strong>{f.value}</strong></div>)}</div>
          {item.sections.map(s=><section key={s.title}><h3>{s.title}</h3><p>{s.body}</p></section>)}
          <div className="knowledge-footnote">Conteúdo cultural e educacional sobre a tradição da Medicina Chinesa. As correspondências são modelos tradicionais e não equivalem, por si só, a relações biomédicas literais.</div>
        </div>
      </aside>
    </div>}
  </>
}
