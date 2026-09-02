import { useState } from 'react'

export function WhyThisQuestion(){
  const [open,setOpen]=useState(false)
  return <div className="why-question">
    <button type="button" onClick={()=>setOpen(v=>!v)}>Por que você está me perguntando isso?</button>
    {open&&<p>Na Medicina Chinesa, a mesma queixa pode aparecer em padrões diferentes. Esta pergunta ajuda a separar combinações possíveis e entender qual delas se aproxima mais do conjunto das suas respostas.</p>}
  </div>
}
