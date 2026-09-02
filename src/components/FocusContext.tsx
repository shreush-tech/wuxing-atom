import {createContext,useContext,useMemo,useState,type ReactNode} from 'react'
import type { FocusElement } from '../content/elementFocusCopy'
import type { RelationshipKind } from '../content/relationshipFocusCopy'

export type RelationshipFocus={
  kind:RelationshipKind
  source:FocusElement
  target:FocusElement
}

type V={
  focus:FocusElement|null
  setFocus:(v:FocusElement|null)=>void
  relationshipFocus:RelationshipFocus|null
  setRelationshipFocus:(v:RelationshipFocus|null)=>void
}

const C=createContext<V|null>(null)

export function FocusProvider({children}:{children:ReactNode}){
  const [focus,setFocus]=useState<FocusElement|null>(null)
  const [relationshipFocus,setRelationshipFocus]=useState<RelationshipFocus|null>(null)

  const value=useMemo(()=>({
    focus,
    setFocus:(v:FocusElement|null)=>{
      setFocus(v)
      if(v)setRelationshipFocus(null)
    },
    relationshipFocus,
    setRelationshipFocus:(v:RelationshipFocus|null)=>{
      setRelationshipFocus(v)
      if(v)setFocus(null)
    }
  }),[focus,relationshipFocus])

  return <C.Provider value={value}>{children}</C.Provider>
}

export function useFocus(){
  const v=useContext(C)
  if(!v)throw new Error('useFocus outside FocusProvider')
  return v
}
