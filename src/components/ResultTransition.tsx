import { useEffect, useState } from 'react'
import { useClinical } from '../clinical/store'

export function ResultTransition(){
  const {clinical}=useClinical()
  const [show,setShow]=useState(false)
  useEffect(()=>{
    if(!clinical.interview.canShowResult){setShow(false);return}
    const t=setTimeout(()=>setShow(true),900)
    return()=>clearTimeout(t)
  },[clinical.interview.canShowResult])
  if(!show)return null
  return <div className="result-transition" aria-hidden="true">
    <span/>
    <p>Das respostas ao mapa. Do mapa para a prática.</p>
  </div>
}
