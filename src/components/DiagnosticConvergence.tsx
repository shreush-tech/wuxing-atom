import { useClinical } from '../clinical/store'
import { buildDiagnosticVisualization } from '../content/diagnosticVisualization'
import { patternLabels } from '../content/resultLabels'

export function DiagnosticConvergence(){
  const {clinical}=useClinical()
  const v=buildDiagnosticVisualization(clinical)
  if(!v.hypotheses.length || clinical.interview.canShowResult)return null

  return <div className="diagnostic-convergence">
    <div className="convergence-head">
      <span>Hipóteses em formação</span>
      <strong>{v.convergence>.62?'Uma direção está ficando mais clara':v.convergence>.32?'Algumas leituras estão competindo':'O mapa ainda está explorando possibilidades'}</strong>
    </div>
    <div className="hypothesis-stack">
      {v.hypotheses.slice(0,3).map((h,i)=>{
        const label=patternLabels[h.id]?.short||h.id
        return <div key={h.id} className={`hypothesis-line ${h.stage}`} style={{opacity:h.opacity}}>
          <i style={{transform:`scaleX(${Math.max(.18,h.relative)})`}}/>
          <span>{i===0?'mais presente':i===1?'ainda próxima':'em segundo plano'}</span>
          <strong>{label}</strong>
        </div>
      })}
    </div>
    <small>As hipóteses podem ganhar ou perder força a cada resposta. O sistema não fecha uma interpretação antes de haver sinais suficientes.</small>
  </div>
}
