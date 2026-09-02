import { useState, type ReactNode } from 'react'

export function DetailsDisclosure({children}:{children:ReactNode}){
  const [open,setOpen]=useState(false)
  return <div className="details-disclosure">
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
      {open?'Fechar detalhes':'Entender por que apareceu'}
      <span>{open?'−':'+'}</span>
    </button>
    {open&&<div className="details-disclosure-body">{children}</div>}
  </div>
}
