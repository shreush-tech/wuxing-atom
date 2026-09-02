import {useMemo,useState} from 'react'
import {useWorkspace} from './WorkspaceProvider'

export function PatientRail(){
  const {state,activePatient,selectPatient,addPatient,toggleRail,closeRail}=useWorkspace()
  const [q,setQ]=useState('')
  const [creating,setCreating]=useState(false)
  const [name,setName]=useState('')

  const list=useMemo(()=>{
    const needle=q.trim().toLocaleLowerCase('pt-BR')
    return state.patients
      .filter(p=>p.status!=='archived')
      .filter(p=>!needle||p.displayName.toLocaleLowerCase('pt-BR').includes(needle))
      .slice(0,40)
  },[state.patients,q])

  if(state.role==='patient')return null

  const submit=()=>{
    const clean=name.trim()
    if(!clean)return
    addPatient(clean);setName('');setCreating(false)
  }

  return <>
    <button className="patient-rail-trigger" onClick={toggleRail} aria-label="Abrir pacientes">
      <span className="rail-dot"/>
      <b>{activePatient?.displayName?.slice(0,1).toUpperCase()||'+'}</b>
      <small>{activePatient?activePatient.displayName:'Pacientes'}</small>
    </button>
    <aside className={`patient-rail ${state.railOpen?'open':''}`} aria-hidden={!state.railOpen}>
      <div className="patient-rail-head">
        <div><span>Workspace</span><strong>{state.role==='physician'?'Pacientes':'Casos de estudo'}</strong></div>
        <button onClick={closeRail} aria-label="Fechar">×</button>
      </div>
      <input className="patient-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome"/>
      <div className="patient-list">
        {list.map(p=><button key={p.id} className={p.id===activePatient?.id?'active':''} onClick={()=>selectPatient(p.id)}>
          <span className="patient-avatar">{p.displayName.slice(0,1).toUpperCase()}</span>
          <span><strong>{p.displayName}</strong><small>{p.sessionCount?`${p.sessionCount} ${p.sessionCount===1?'sessão':'sessões'}`:'novo'}</small></span>
        </button>)}
        {!list.length&&!creating&&<p className="patient-empty">Nenhum paciente aqui ainda.</p>}
      </div>
      {creating?<div className="patient-create">
        <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit()}} placeholder="Nome do paciente"/>
        <div><button onClick={()=>setCreating(false)}>Cancelar</button><button onClick={submit}>Criar</button></div>
      </div>:<button className="patient-add" onClick={()=>setCreating(true)}>+ Novo paciente</button>}
      <p className="rail-privacy">Protótipo: dados ficam apenas em memória nesta sessão, salvo se o modo de demonstração for ativado explicitamente.</p>
    </aside>
    {state.railOpen&&<button className="patient-rail-backdrop" aria-label="Fechar pacientes" onClick={closeRail}/>}
  </>
}
