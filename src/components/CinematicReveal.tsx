import { useEffect,useRef,useState } from 'react'
import { useClinical } from '../clinical/store'
import { revealPhase,revealCopy,type RevealPhase } from '../content/revealTimeline'

export function CinematicReveal(){
  const {clinical}=useClinical()
  const wasReady=useRef(false)
  const [phase,setPhase]=useState<RevealPhase>('idle')
  const [running,setRunning]=useState(false)

  useEffect(()=>{
    if(clinical.interview.canShowResult && !wasReady.current){
      const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if(reduce){ setPhase('settled'); setRunning(false) }
      else{
        setRunning(true)
        const start=performance.now()
        let raf=0
        const tick=(now:number)=>{
          const p=revealPhase(now-start)
          setPhase(p)
          if(p!=='settled') raf=requestAnimationFrame(tick)
          else setRunning(false)
        }
        raf=requestAnimationFrame(tick)
        return ()=>cancelAnimationFrame(raf)
      }
    }
    wasReady.current=clinical.interview.canShowResult
  },[clinical.interview.canShowResult])

  if(phase==='idle')return null
  return <div className={`cinematic-reveal ${phase} ${running?'running':'done'}`} aria-live="polite">
    <div className="reveal-line"/>
    <p>{revealCopy[phase]}</p>
  </div>
}
