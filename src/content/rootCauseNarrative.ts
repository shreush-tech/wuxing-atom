import type { ClinicalState } from '../clinical/types'
import { patternLabels } from './resultLabels'

export interface RootCauseNarrative{
  mode:'single'|'paired'|'open'
  headline:string
  body:string
  primary?:string
  companion?:string
}

export function buildRootCauseNarrative(c:ClinicalState):RootCauseNarrative{
  const active=c.patterns.filter(p=>p.raw>0)
  const first=active[0], second=active[1]
  if(!first)return {mode:'open',headline:'A origem do mapa ainda está aberta',body:'Ainda não há sinais suficientes para organizar uma hipótese principal.'}

  const firstLabel=patternLabels[first.id]?.short||first.id
  const secondLabel=second ? (patternLabels[second.id]?.short||second.id) : undefined

  if(c.relationship && second){
    return {
      mode:'paired',
      headline:'Um padrão parece organizar parte dos outros sinais',
      body:'Na leitura tradicional, o mapa não precisa ter apenas um padrão. O sistema mantém uma hipótese principal e observa como ela pode se relacionar com manifestações associadas, sem transformar essa sequência em certeza causal.',
      primary:firstLabel,
      companion:secondLabel
    }
  }
  return {
    mode:'single',
    headline:'Há uma hipótese principal, mas a origem continua sendo refinada',
    body:'A leitura prioriza o padrão mais sustentado pela queixa e pelas respostas, mantendo espaço para padrões associados.',
    primary:firstLabel
  }
}
