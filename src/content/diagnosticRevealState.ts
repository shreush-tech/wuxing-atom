import type { ClinicalState } from '../clinical/types'

export type RevealPhase='interview'|'gathering'|'reveal'|'result'

export type DiagnosticRevealState={
  phase:RevealPhase
  progress:number
  canReveal:boolean
  leadingPatternId:string|null
  runnerUpPatternId:string|null
}

export function diagnosticRevealState(c:ClinicalState):DiagnosticRevealState{
  const answered=Math.max(0,Number(c.interview?.answeredCount||0))
  const yes=Math.max(0,Number(c.interview?.yesCount||0))
  const canReveal=Boolean(c.interview?.canShowResult)
  const info=Math.max(0,Math.min(1,Number(c.interview?.informationLevel||0)))

  let phase:RevealPhase='interview'
  if(canReveal) phase='result'
  else if(answered>=2 || yes>=1) phase='gathering'

  return {
    phase,
    progress:info,
    canReveal,
    leadingPatternId:c.interview?.leadingPatternId||null,
    runnerUpPatternId:c.interview?.runnerUpPatternId||null
  }
}
