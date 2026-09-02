import {useEffect,useMemo,useState} from 'react'
import {atomRuntimeVerdict,getAtomRuntimeSnapshot} from '../runtime/atomRuntimeDiagnostics'

export function AtomAcceptancePanel(){
  const enabled=useMemo(()=>typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('atomTest')==='1',[])
  const [snap,setSnap]=useState<ReturnType<typeof getAtomRuntimeSnapshot>|null>(null)

  useEffect(()=>{
    if(!enabled)return
    const update=()=>setSnap(getAtomRuntimeSnapshot())
    update()
    window.addEventListener('resize',update)
    window.addEventListener('orientationchange',update)
    return()=>{window.removeEventListener('resize',update);window.removeEventListener('orientationchange',update)}
  },[enabled])

  if(!enabled||!snap)return null
  const verdict=atomRuntimeVerdict(snap)
  const checks=[
    ['WebGL',snap.webgl],
    ['WebGL2',snap.webgl2],
    ['Toque',snap.touch],
    ['Motion permitido',!snap.reducedMotion],
    ['Viewport',snap.width>0&&snap.height>0],
  ] as const

  return <aside className="atom-acceptance-panel">
    <div className="acceptance-title">RUNTIME CHECK</div>
    <div className={`acceptance-verdict v-${verdict.level}`}>{verdict.label}</div>
    <div className="acceptance-grid">
      {checks.map(([label,ok])=><div key={label}><span>{label}</span><b>{ok?'ok':'—'}</b></div>)}
      <div><span>DPR</span><b>{snap.dpr.toFixed(2)}</b></div>
      <div><span>CPU</span><b>{snap.cores??'?'}</b></div>
      <div><span>RAM</span><b>{snap.memoryGB?`${snap.memoryGB} GB`:'?'}</b></div>
      <div><span>Tela</span><b>{snap.width}×{snap.height}</b></div>
    </div>
    <small>{verdict.reason}</small>
  </aside>
}
