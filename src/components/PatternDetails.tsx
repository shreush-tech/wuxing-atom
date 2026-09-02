import { bookPatternDetails } from '../content/bookPatterns'
import type { PatternId } from '../clinical/types'

export function PatternDetails({patternId}:{patternId:PatternId}){
  const d=bookPatternDetails[patternId as keyof typeof bookPatternDetails]
  if(!d)return null
  return <details className="technical-details">
    <summary>Ver interpretação tradicional</summary>
    <div className="technical-body">
      <div><strong>Sinais descritos no livro</strong><br/>{d.symptoms.join(' · ')}</div>
      <div><strong>Pontos listados na referência</strong><br/>{d.acupuncture.join(' · ')}</div>
      <div><strong>Fórmula citada</strong><br/>{d.formula}</div>
      <small>Conteúdo de referência para educação. A seleção de pontos/fórmulas não é uma prescrição individual.</small>
    </div>
  </details>
}
