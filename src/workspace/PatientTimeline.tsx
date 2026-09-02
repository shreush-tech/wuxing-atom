import {useWorkspace} from './WorkspaceProvider'
import {patientSessions,symptomTrajectory,painLocations} from './model'

export function PatientTimeline(){
  const {state,activePatient,viewSession}=useWorkspace()
  if(state.role==='patient'||!activePatient)return null
  const sessions=patientSessions(state.sessions,activePatient.id)
  const trajectory=symptomTrajectory(state.sessions,activePatient.id)
  const pains=painLocations(state.sessions,activePatient.id)
  if(!sessions.length)return <section className="patient-timeline patient-timeline-empty">
    <span>Evolução</span><strong>Registre a primeira sessão para começar a comparar o mapa ao longo do tempo.</strong>
  </section>

  const pts=trajectory.map((p,i)=>{
    const x=trajectory.length===1?0:(i/(trajectory.length-1))*100
    const y=100-(p.value/10)*100
    return `${x},${y}`
  }).join(' ')

  return <section className="patient-timeline">
    <header><div><span>Evolução</span><h3>{activePatient.displayName}</h3></div><strong>{sessions.length} {sessions.length===1?'sessão':'sessões'}</strong></header>
    {trajectory.length>0&&<div className="trajectory-card">
      <div className="trajectory-label"><span>Intensidade global relatada</span><small>0 = mínima · 10 = máxima</small></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Evolução dos sintomas">
        <line x1="0" y1="50" x2="100" y2="50"/>
        <polyline points={pts}/>
        {trajectory.map((p,i)=>{
          const x=trajectory.length===1?0:(i/(trajectory.length-1))*100
          const y=100-(p.value/10)*100
          return <circle key={p.session} cx={x} cy={y} r="2.1"/>
        })}
      </svg>
    </div>}
    {pains.length>0&&<div className="pain-history">
      <div className="trajectory-label"><span>Dor relatada por local</span><small>intensidade 0–10 por sessão</small></div>
      {pains.slice(0,8).map(p=><div className="pain-history-row" key={p.location.toLocaleLowerCase('pt-BR')}>
        <strong>{p.location}</strong>
        <div>{p.values.slice(-8).map(v=><span key={`${v.session}-${v.date}`} title={`Sessão ${v.session}`}>{v.intensity}</span>)}</div>
      </div>)}
    </div>}
    <div className="timeline-list">
      {[...sessions].reverse().slice(0,10).map(s=><button type="button" className={state.viewSessionId===s.id?'history-active':''} key={s.id} onClick={()=>viewSession(s.id)}>
        <div><b>{String(s.number).padStart(2,'0')}</b><span>{new Date(s.occurredAt).toLocaleDateString('pt-BR')}</span></div>
        <div>
          <strong>{s.patterns[0]?.label||'Mapa em construção'}</strong>
          {(s.pains||[]).length>0&&<small className="session-pain">{(s.pains||[]).map(p=>`${p.location} ${p.intensity}/10`).join(' · ')}</small>}
          {s.usedPoints.length>0&&<small>{s.usedPoints.map(p=>p.displayCode||p.code).join(' · ')}</small>}
          {s.clinicianNote&&<p>{s.clinicianNote}</p>}
          <i>Ver este mapa</i>
        </div>
      </button>)}
    </div>
  </section>
}
