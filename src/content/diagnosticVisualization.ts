import type { ClinicalState, PatternId } from '../clinical/types'

export type HypothesisVisualStage='latent'|'emerging'|'competing'|'leading'|'resolved'

export interface HypothesisVisual {
  id:PatternId
  stage:HypothesisVisualStage
  relative:number
  opacity:number
  scale:number
  pulse:number
}

export interface DiagnosticVisualization {
  hypotheses:HypothesisVisual[]
  convergence:number
  ambiguity:number
  resolved:boolean
}

export function buildDiagnosticVisualization(c:ClinicalState):DiagnosticVisualization{
  const scored=c.patterns.filter(p=>p.raw>0).slice(0,4)
  const top=scored[0]?.raw||0
  const second=scored[1]?.raw||0
  const denom=Math.max(top,1)
  const separation=Math.max(0,Math.min(1,(top-second)/Math.max(top,1)))
  const answered=Math.max(0,c.interview.informationLevel||0)
  const infoFactor=Math.max(0,Math.min(1,answered/8))
  const convergence=Math.max(0,Math.min(1,separation*.72+infoFactor*.28))
  const ambiguity=1-convergence
  const resolved=Boolean(c.interview.canShowResult && c.interview.readiness!=='ambiguous')

  return {
    hypotheses:scored.map((p,i)=>{
      const relative=Math.max(.08,Math.min(1,p.raw/denom))
      const stage:HypothesisVisualStage=
        resolved&&i===0?'resolved':
        i===0&&relative>.82?'leading':
        i<2&&relative>.55?'competing':
        relative>.25?'emerging':'latent'
      return {
        id:p.id,
        stage,
        relative,
        opacity:.2+relative*.8,
        scale:.88+relative*.16,
        pulse:stage==='competing'?.55:stage==='leading'?.72:stage==='resolved'?.35:.25
      }
    }),
    convergence,
    ambiguity,
    resolved
  }
}
