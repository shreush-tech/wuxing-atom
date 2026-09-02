import {createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react'
import type {PatientRecord,SessionRecord,WorkspaceRole,WorkspaceState} from './types'
import {appendSession,createPatient,setWorkspaceRole,workspaceInitialState} from './model'
import {createWorkspaceRepository,type WorkspaceRepository} from './repository'
import {sanitizeWorkspace} from './integrity'

type WorkspaceContextValue={
  state:WorkspaceState
  activePatient:PatientRecord|null
  setRole:(role:WorkspaceRole)=>void
  toggleRail:()=>void
  closeRail:()=>void
  addPatient:(name:string)=>PatientRecord
  selectPatient:(id:string|null)=>void
  viewSession:(id:string|null)=>void
  addSession:(session:SessionRecord)=>void
  patientSessions:(patientId:string)=>SessionRecord[]
  repositoryMode:'memory'|'demo-browser'
}

const Ctx=createContext<WorkspaceContextValue|null>(null)

export function WorkspaceProvider({children}:{children:ReactNode}){
  const repoRef=useRef<WorkspaceRepository>()
  if(!repoRef.current)repoRef.current=createWorkspaceRepository()
  const repo=repoRef.current
  const [state,setState]=useState<WorkspaceState>(workspaceInitialState)
  const [hydrated,setHydrated]=useState(false)

  useEffect(()=>{repo.load().then(s=>{setState(sanitizeWorkspace(s));setHydrated(true)}).catch(()=>{setState(workspaceInitialState);setHydrated(true)})},[])
  useEffect(()=>{if(hydrated)repo.save(state)},[state,hydrated])

  const activePatient=useMemo(
    ()=>state.patients.find(p=>p.id===state.activePatientId)||null,
    [state.patients,state.activePatientId]
  )
  const value:WorkspaceContextValue={
    state,
    activePatient,
    setRole:(role)=>setState(s=>setWorkspaceRole(s,role)),
    toggleRail:()=>setState(s=>({...s,railOpen:!s.railOpen})),
    closeRail:()=>setState(s=>({...s,railOpen:false})),
    addPatient:(name)=>{
      const p=createPatient(name)
      setState(s=>({...s,patients:[p,...s.patients],activePatientId:p.id,railOpen:false}))
      return p
    },
    selectPatient:(id)=>setState(s=>({...s,activePatientId:id,viewSessionId:null,railOpen:false})),
    viewSession:(id)=>setState(s=>{
      if(id===null)return {...s,viewSessionId:null}
      const valid=s.sessions.some(x=>x.id===id&&x.patientId===s.activePatientId)
      return valid?{...s,viewSessionId:id}:s
    }),
    addSession:(session)=>setState(s=>({...appendSession(s,session),viewSessionId:null})),
    patientSessions:(patientId)=>state.sessions.filter(s=>s.patientId===patientId).sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt)),
    repositoryMode:new URLSearchParams(location.search).get('demoStorage')==='1'?'demo-browser':'memory'
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorkspace(){
  const x=useContext(Ctx)
  if(!x)throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return x
}
