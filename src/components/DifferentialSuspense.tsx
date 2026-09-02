import { useClinical } from '../clinical/store'
import { buildDifferentialFocus } from '../content/differentialFocus'
import { patternLabels } from '../content/resultLabels'

export function DifferentialSuspense(){
  const {clinical}=useClinical()
  const d=buildDifferentialFocus(clinical)
  if(!d.close || clinical.interview.canShowResult)return null
  const a=d.first ? patternLabels[d.first]?.short : ''
  const b=d.second ? patternLabels[d.second]?.short : ''
  return <div className="differential-suspense">
    <span>Diferencial em aberto</span>
    <div className="differential-pair">
      <strong>{a}</strong><i>↔</i><strong>{b}</strong>
    </div>
    <p>{d.reason}</p>
    <small>Se as respostas não separarem bem as possibilidades, o resultado preservará a ambiguidade em vez de escolher artificialmente uma delas.</small>
  </div>
}
