import { symptoms } from '../clinical/symptoms'
import { complaintSafetyPrompts } from '../clinical/complaintPaths'
import { computeSafety } from '../clinical/safetyGate'
import { useClinical } from '../clinical/store'

export function SafetyGate(){
  const {selected,setAnswer,removeAnswer}=useClinical()
  const main=Object.entries(selected).find(([id,v])=>v==='yes' && complaintSafetyPrompts[id])?.[0]
  if(!main)return null
  const ids=(complaintSafetyPrompts[main]||[]).filter(id=>selected[id]===undefined)
  const safety=computeSafety(selected)
  const revise=()=>{
    removeAnswer(main)
    ;(complaintSafetyPrompts[main]||[]).forEach(id=>{if(selected[id]==='yes')removeAnswer(id)})
  }

  if(safety.level==='urgent')return <div className="safety-block urgent">
    <strong>Alerta de segurança</strong>
    <p>{safety.message}</p>
    <ul>{safety.triggers.map(x=><li key={x}>{x}</li>)}</ul>
    <p className="safety-action">Se esses sinais estiverem acontecendo de verdade, procure avaliação médica urgente. Em uma emergência, acione o serviço de emergência da sua região.</p>
    <button type="button" className="safety-revise" onClick={revise}>Corrigir resposta / refazer</button>
    <small>Esta é uma interface educativa e de aprendizado em Medicina Chinesa. Ela não estabelece diagnóstico médico e não substitui avaliação por profissional habilitado.</small>
  </div>

  if(!ids.length && safety.level==='clear')return null
  return <div className={`safety-block ${safety.level}`}>
    <strong>Antes de continuar</strong>
    {safety.message && <p>{safety.message}</p>}
    {ids.length>0 && <><p>Algum destes sinais está acontecendo agora ou faz parte desta queixa?</p><div className="safety-questions">
      {ids.slice(0,4).map(id=>{const s=symptoms.find(x=>x.id===id);return s?<div key={id}><span>{s.label}</span><div><button onClick={()=>setAnswer(id,'yes')}>Sim</button><button onClick={()=>setAnswer(id,'no')}>Não</button></div></div>:null})}
    </div></>}
    <small>Interface educativa; não substitui diagnóstico ou avaliação médica.</small>
  </div>
}
