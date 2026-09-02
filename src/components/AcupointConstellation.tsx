import { useState } from 'react'
import { useClinical } from '../clinical/store'
import { practicalRecommendations } from '../content/practicalRecommendations'
import { acupointAtlas } from '../content/acupointAtlas'

export function AcupointConstellation(){
  const {clinical}=useClinical()
  const [open,setOpen]=useState(false)
  if(!clinical.interview.canShowResult)return null
  const top=clinical.patterns[0]
  if(!top)return null
  const rec=practicalRecommendations[top.id]
  const points=(rec?.acupressurePoints||[]).map(id=>acupointAtlas[id]).filter(Boolean)
  if(!points.length)return null

  return <section className={`point-constellation ${open?'open':''}`}>
    <button className="point-constellation-head" onClick={()=>setOpen(v=>!v)}>
      <span>Depois da leitura</span>
      <strong>Explorar acupontos relacionados ao seu mapa</strong>
      <i>{open?'−':'+'}</i>
    </button>
    {open&&<div className="point-orbit-map">
      <div className="point-core">氣</div>
      {points.slice(0,4).map((p,i)=><div key={p.id} className={`orbit-point p${i+1}`}>
        <b>{p.id}</b><span>{p.name}</span>
      </div>)}
      <p>Uma representação visual educativa. Os acupontos entram somente depois da leitura para que o foco principal continue sendo compreender o padrão.</p>
    </div>}
  </section>
}
