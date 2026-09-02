import type {WorkspaceState} from './types'
import {workspaceInitialState} from './model'
import {sanitizeWorkspace} from './integrity'

export interface WorkspaceRepository{
  load():Promise<WorkspaceState>
  save(state:WorkspaceState):Promise<void>
}

/**
 * Prototype-only repository.
 * It intentionally keeps data in memory by default so sensitive clinical notes
 * are not silently persisted in the browser.
 */
export class MemoryWorkspaceRepository implements WorkspaceRepository{
  private state:WorkspaceState=structuredClone(workspaceInitialState)
  async load(){return structuredClone(this.state)}
  async save(state:WorkspaceState){this.state=structuredClone(state)}
}

/**
 * Explicit demo persistence. Never use this adapter for production health data.
 * Production must use authenticated, tenant-isolated server storage.
 */
export class BrowserDemoWorkspaceRepository implements WorkspaceRepository{
  constructor(private key='wuxing-demo-workspace-v094'){}
  async load(){
    try{
      const raw=localStorage.getItem(this.key)
      return raw?sanitizeWorkspace(JSON.parse(raw)):structuredClone(workspaceInitialState)
    }catch{
      return structuredClone(workspaceInitialState)
    }
  }
  async save(state:WorkspaceState){
    localStorage.setItem(this.key,JSON.stringify(state))
  }
}

export function createWorkspaceRepository():WorkspaceRepository{
  const demo=new URLSearchParams(location.search).get('demoStorage')==='1'
  return demo?new BrowserDemoWorkspaceRepository():new MemoryWorkspaceRepository()
}
