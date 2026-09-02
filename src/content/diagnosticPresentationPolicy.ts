import type {PatternScore} from '../clinical/types'

export const diagnosticPresentationPolicy={
  visuallyProminentPatterns:2,
  associatedPatternsLabel:'Outros padrões associados',
  multiSystemHeading:'Padrões que apareceram em sistemas diferentes',
  relationshipHeading:'Combinações e relações entre sistemas',
  evidenceAction:'Entender por que apareceu'
} as const

export function splitPatternsForLayResult(patterns:PatternScore[]){
  const supported=patterns.filter(p=>p.raw>0)
  return {
    prominent:supported.slice(0,diagnosticPresentationPolicy.visuallyProminentPatterns),
    associated:supported.slice(diagnosticPresentationPolicy.visuallyProminentPatterns)
  }
}
