import {useWorkspace} from './WorkspaceProvider'

export function HistoricalViewBanner(){
  const {state,activePatient,viewSession}=useWorkspace()
  if(state.role==='patient'||!activePatient||!state.viewSessionId)return null
  const s=state.sessions.find(x=>x.id===state.viewSessionId)
  if(!s)return null
  return <div className="history-view-banner">
    <div>
      <span>Visualizando histórico</span>
      <strong>{activePatient.displayName} · Sessão {s.number}</strong>
      <small>{new Date(s.occurredAt).toLocaleDateString('pt-BR')}</small>
    </div>
    <button onClick={()=>viewSession(null)}>Voltar ao mapa atual</button>
  </div>
}
