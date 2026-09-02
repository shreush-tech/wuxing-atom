import { useEffect, useState } from 'react'
import { useClinical } from '../clinical/store'

export function ConsultationHandoff(){
  const {clinical}=useClinical()
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const fn=()=>setOpen(true)
    document.addEventListener('wuxing-book-consultation',fn)
    return()=>document.removeEventListener('wuxing-book-consultation',fn)
  },[])
  if(!open)return null
  const top=clinical.patterns.slice(0,2).map(p=>p.id)
  return <div className="handoff-backdrop" onClick={()=>setOpen(false)}>
    <div className="handoff" onClick={e=>e.stopPropagation()}>
      <button className="handoff-close" onClick={()=>setOpen(false)}>×</button>
      <div className="aftercare-kicker">Consulta de acupuntura</div>
      <h3>Seu equilíbrio orgânico pode acompanhar você</h3>
      <p>O site pode encaminhar um resumo das respostas e das duas hipóteses principais para a etapa de agendamento. O protótipo ainda não envia dados pessoais nem agenda automaticamente.</p>
      <div className="handoff-summary"><strong>Hipóteses atuais</strong><span>{top.join(' · ')}</span></div>
      <button className="primary-cta" type="button">Continuar para agendamento</button>
      <small>A integração com agenda será conectada apenas quando o destino e a política de dados estiverem definidos.</small>
    </div>
  </div>
}
