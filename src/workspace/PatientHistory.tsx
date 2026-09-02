import {useMemo,useState} from 'react'
import {useWorkspace} from './WorkspaceProvider'
import {elementSeries,patientLongitudinalSummary,patientSessions,painLocations,patternTrajectory,symptomTrajectory} from './model'

const labels={wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'} as const
const glyphs={wood:'木',fire:'火',earth:'土',metal:'金',water:'水'} as const

function linePoints(values:number[],max=10){
  if(!values.length)return ''
  return values.map((v,i)=>{
    const x=values.length===1?50:(i/(values.length-1))*100
    const y=92-(Math.max(0,Math.min(max,v))/max)*84
    return `${x},${y}`
  }).join(' ')
}

export function PatientHistory(){
  const {state,activePatient,viewSession}=useWorkspace()
  const [tab,setTab]=useState<'overview'|'elements'|'pain'|'patterns'|'sessions'>('overview')
  if(state.role==='patient'||!activePatient)return null
  const sessions=patientSessions(state.sessions,activePatient.id)
  if(!sessions.length)return null
  const elements=elementSeries(state.sessions,activePatient.id)
  const pains=painLocations(state.sessions,activePatient.id)
  const patterns=patternTrajectory(state.sessions,activePatient.id)
  const symptoms=symptomTrajectory(state.sessions,activePatient.id)
  const summary=patientLongitudinalSummary(state.sessions,activePatient.id)

  return <section className="patient-history">
    <header className="history-hero">
      <div><span>Histórico individual</span><h2>{activePatient.displayName}</h2><p>{summary.sessionCount} {summary.sessionCount===1?'avaliação registrada':'avaliações registradas'} · acompanhamento longitudinal</p></div>
      <div className="history-dates"><small>Primeira</small><strong>{summary.firstDate?new Date(summary.firstDate).toLocaleDateString('pt-BR'):'—'}</strong><small>Mais recente</small><strong>{summary.lastDate?new Date(summary.lastDate).toLocaleDateString('pt-BR'):'—'}</strong></div>
    </header>

    <nav className="history-tabs">
      {([['overview','Visão geral'],['elements','5 elementos'],['pain','Dor'],['patterns','Desequilíbrios'],['sessions','Sessões']] as const).map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}
    </nav>

    {tab==='overview'&&<div className="history-grid">
      <article className="history-card history-elements-mini"><span>Mapa atual</span><div>{summary.latestElements.map(e=><div key={e.element}><b>{glyphs[e.element]}</b><small>{labels[e.element]}</small><strong>{Math.round(e.activity*100)}%</strong></div>)}</div></article>
      <article className="history-card"><span>Dor atual</span>{summary.latestPain.length?summary.latestPain.slice(0,5).map(p=><div className="history-kv" key={p.location}><strong>{p.location}</strong><b>{p.intensity}/10</b></div>):<p>Sem dor registrada na última série.</p>}</article>
      <article className="history-card"><span>Desequilíbrios mais recentes</span>{summary.latestPatterns.length?summary.latestPatterns.map(p=><div className="history-kv" key={p.id}><strong>{p.label}</strong><b>{Math.round(p.confidence*100)}%</b></div>):<p>Sem padrão consolidado.</p>}</article>
      <article className="history-card"><span>Sintomas relatados</span>{symptoms.length?<><svg className="history-chart" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={linePoints(symptoms.map(x=>x.value))}/></svg><small>Intensidade global registrada por sessão</small></>:<p>Ainda sem escala global longitudinal.</p>}</article>
    </div>}

    {tab==='elements'&&<div className="history-section">
      <div className="history-section-title"><span>Evolução dos Cinco Movimentos</span><small>atividade visual relativa do mapa em cada sessão</small></div>
      <div className="five-element-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {[25,50,75].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} className="gridline"/>)}
          {elements.map(e=><polyline key={e.element} className={`element-line ${e.element}`} points={linePoints(e.values.map(v=>v.value),1)}/>)}
        </svg>
        <div className="element-legend">{elements.map(e=><span key={e.element} className={e.element}><b>{glyphs[e.element]}</b>{labels[e.element]}</span>)}</div>
      </div>
      <div className="element-session-table">{sessions.slice(-12).map(s=><div key={s.id}><strong>S{s.number}</strong>{elements.map(e=><span key={e.element}>{Math.round((e.values.find(v=>v.session===s.number)?.value||0)*100)}</span>)}</div>)}</div>
    </div>}

    {tab==='pain'&&<div className="history-section">
      <div className="history-section-title"><span>Evolução da dor</span><small>escala relatada de 0 a 10, separada por local</small></div>
      {pains.length?pains.map(p=><article className="pain-chart-card" key={p.location.toLocaleLowerCase('pt-BR')}>
        <header><strong>{p.location}</strong><b>{p.values.at(-1)?.intensity}/10</b></header>
        <svg className="history-chart" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="50" x2="100" y2="50" className="gridline"/><polyline points={linePoints(p.values.map(v=>v.intensity))}/>{p.values.map((v,i)=>{const x=p.values.length===1?50:(i/(p.values.length-1))*100;const y=92-(v.intensity/10)*84;return <circle key={`${v.session}-${v.date}`} cx={x} cy={y} r="2"/>})}</svg>
        <footer>{p.values.map(v=><span key={`${v.session}-${v.date}`}>S{v.session} <b>{v.intensity}</b></span>)}</footer>
      </article>):<p className="history-empty">Nenhuma dor registrada.</p>}
    </div>}

    {tab==='patterns'&&<div className="history-section">
      <div className="history-section-title"><span>Desequilíbrios ao longo do tempo</span><small>cada padrão continua independente; o gráfico não cria combinações diagnósticas</small></div>
      {patterns.slice(0,8).map(p=><article className="pattern-history-row" key={p.id}><strong>{p.label}</strong><div>{p.values.slice(-12).map(v=><span key={`${p.id}-${v.session}`} title={`Sessão ${v.session}`} style={{opacity:.18+.82*v.confidence}}>{Math.round(v.confidence*100)}</span>)}</div></article>)}
    </div>}

    {tab==='sessions'&&<div className="history-section">
      <div className="history-section-title"><span>Avaliações e sessões</span><small>toque para reabrir o mapa exato daquela data</small></div>
      <div className="history-session-list">{[...sessions].reverse().map(s=><button key={s.id} className={state.viewSessionId===s.id?'active':''} onClick={()=>viewSession(s.id)}>
        <b>Sessão {s.number}</b><span>{new Date(s.occurredAt).toLocaleDateString('pt-BR')}</span>
        <strong>{s.patterns[0]?.label||'Mapa em construção'}</strong>
        {(s.pains||[]).length>0&&<small>{(s.pains||[]).map(p=>`${p.location} ${p.intensity}/10`).join(' · ')}</small>}
        <i>Reabrir avaliação</i>
      </button>)}</div>
    </div>}
  </section>
}
