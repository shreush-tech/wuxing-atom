import {useWorkspace} from './WorkspaceProvider'

export function RoleSwitcher(){
  const {state,setRole}=useWorkspace()
  return <div className="role-switch" aria-label="Modo de uso">
    <button className={state.role==='patient'?'active':''} onClick={()=>setRole('patient')}>Meu equilíbrio</button>
    <button className={state.role==='student'?'active':''} onClick={()=>setRole('student')}>Estudante</button>
    <button className={state.role==='physician'?'active':''} onClick={()=>setRole('physician')}>Profissional</button>
  </div>
}
