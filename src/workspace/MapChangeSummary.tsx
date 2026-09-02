import {useWorkspace} from './WorkspaceProvider'
import {patientSessions} from './model'
import type {ElementId} from '../clinical/types'

const labels:Record<ElementId,string>={wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'}
const ids:ElementId[]=['wood','fire','earth','metal','water']

export function MapChangeSummary(){
  const {state,activePatient}=useWorkspace()
  if(state.role==='patient'||!activePatient)return null
  const sessions=patientSessions(state.sessions,activePatient.id)
  if(sessions.length<2)return null

  const previous=sessions[sessions.length-2]
  const latest=sessions[sessions.length-1]
  const changes=ids.map(id=>({
    id,
    delta:latest.elements[id].activity-previous.elements[id].activity
  })).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))

  return <section className="map-change-summary">
    <div className="map-change-head">
      <span>Mudança do mapa</span>
      <small>Sessão {previous.number} → {latest.number}</small>
    </div>
    <div className="map-change-grid">
      {changes.map(x=><div key={x.id}>
        <strong>{labels[x.id]}</strong>
        <span>{Math.abs(x.delta)<.02?'estável':x.delta>0?'mais presente':'menos presente'}</span>
      </div>)}
    </div>
    <p>Esta comparação descreve a mudança do mapa tradicional calculado a partir das respostas; não representa melhora ou piora biomédica por si só.</p>
  </section>
}
