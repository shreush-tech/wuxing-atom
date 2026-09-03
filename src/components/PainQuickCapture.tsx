import {useEffect} from 'react'
import {useClinical} from '../clinical/store'

export function PainQuickCapture(){
  const {selected,painReports,addPainReport,updatePainReport,removePainReport}=useClinical()
  const enabled=selected.pain_general==='yes'
  useEffect(()=>{if(enabled&&!painReports.length)addPainReport()},[enabled])
  if(!enabled)return null
  return <section className="pain-quick" aria-label="Detalhes da dor">
    <div className="pain-quick-head"><div><span>Dimensão independente</span><strong>Onde dói hoje?</strong></div><button type="button" onClick={addPainReport}>+ outro local</button></div>
    <p>A dor é registrada separadamente do equilíbrio dos Cinco Movimentos. Localização e intensidade ajudam a acompanhar sua evolução.</p>
    <div className="pain-quick-list">{painReports.map((pain,index)=><div className="pain-quick-item" key={pain.id}>
      <div className="pain-quick-location"><label>{painReports.length>1?`Local ${index+1}`:'Local da dor'}</label><input value={pain.location} onChange={e=>updatePainReport(pain.id,{location:e.target.value})} placeholder="Ex.: ouvido direito, joelho, lombar, ombro..."/>{painReports.length>1&&<button type="button" onClick={()=>removePainReport(pain.id)} aria-label="Remover local">×</button>}</div>
      <div className="pain-quick-scale"><div><span>Intensidade</span><b>{pain.intensity}/10</b></div><input type="range" min="0" max="10" step="1" value={pain.intensity} onChange={e=>updatePainReport(pain.id,{intensity:Number(e.target.value)})}/><div className="pain-quick-ticks"><span>0</span><span>5</span><span>10</span></div></div>
    </div>)}</div>
  </section>
}
