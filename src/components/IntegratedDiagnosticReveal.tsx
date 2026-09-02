import {useEffect,useRef,useState} from 'react'
import {useClinical} from '../clinical/store'
import {diagnosticRevealState} from '../content/diagnosticRevealState'

export function IntegratedDiagnosticReveal(){
  const {clinical}=useClinical()
  const state=diagnosticRevealState(clinical)
  const [active,setActive]=useState(false)
  const [stage,setStage]=useState(0)
  const seen=useRef(false)

  useEffect(()=>{
    if(!state.canReveal || seen.current)return
    seen.current=true
    setActive(true)
    setStage(1)
    const a=setTimeout(()=>setStage(2),520)
    const b=setTimeout(()=>setStage(3),1180)
    const c=setTimeout(()=>setStage(4),1820)
    const d=setTimeout(()=>setActive(false),2400)
    return ()=>{clearTimeout(a);clearTimeout(b);clearTimeout(c);clearTimeout(d)}
  },[state.canReveal])

  if(!active)return null

  return <div className={`integrated-reveal reveal-stage-${stage}`} aria-hidden="true">
    <div className="reveal-vignette"/>
    <div className="reveal-copy">
      <span>{stage<3?'Seu mapa está ganhando forma':'Seu mapa'}</span>
    </div>
  </div>
}
