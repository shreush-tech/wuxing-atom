import { symptoms } from '../clinical/symptoms'
import { complaintSafetyPrompts } from '../clinical/complaintPaths'
import { computeSafety } from '../clinical/safetyGate'
import { useClinical } from '../clinical/store'

export function SafetyGate(){
  const {selected,setAnswer}=useClinical()
  const main=Object.entries(selected).find(([id,v])=>v==='yes' && complaintSafetyPrompts[id])?.[0]
  if(!main)return null
  const ids=(complaintSafetyPrompts[main]||[]).filter(id=>selected[id]===undefined)
  const safety=computeSafety(selected)

  if(safety.level==='urgent')return <div className="safety-block urgent">
    <strong>Interrompemos o mapa por segurança</strong>
    <p>{safety.message}</p>
    <ul>{safety.triggers.map(x=><li key={x}>{x}</li>)}</ul>
    <p className="safety-action">Procure avaliação médica urgente. Em uma emergência, acione o serviço de emergência da sua região.</p>
  </div>

  if(!ids.length && safety.level==='clear')return null

  return <div className={`safety-block ${safety.level}`}>
    <strong>Antes de continuar</strong>
    {safety.message && <p>{safety.message}</p>}
    {ids.length>0 && <>
      <p>Algum destes sinais está acontecendo agora ou faz parte desta queixa?</p>
      <div className="safety-questions">
        {ids.slice(0,4).map(id=>{
          const s=symptoms.find(x=>x.id===id)
          return s?<div key={id}><span>{s.label}</span><div>
            <button onClick={()=>setAnswer(id,'yes')}>Sim</button>
            <button onClick={()=>setAnswer(id,'no')}>Não</button>
          </div></div>:null
        })}
      </div>
    </>}
  </div>
}
