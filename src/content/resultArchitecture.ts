import type {ClinicalState} from '../clinical/types'

export type ResultArchitecture={
  hasResult:boolean
  primary:string|null
  secondary:string|null
  relationship:any|null
  confidenceLabel:string
}

export function resultArchitecture(c:ClinicalState):ResultArchitecture{
  const rr=c.interview?.readingReadiness
  const confidenceLabel=rr==='well_supported'
    ?'Desequilíbrio bem sustentado pelas suas respostas'
    :rr==='refinable'
      ?'Desequilíbrio ganhando consistência'
      :'Sinais iniciais · leitura preliminar'

  return {
    hasResult:Boolean(c.interview?.canShowResult),
    primary:c.interview?.leadingPatternId||null,
    secondary:c.interview?.runnerUpPatternId||null,
    relationship:Array.isArray((c as any).relationships)
      ?(c as any).relationships[0]||null
      :(c as any).relationship||null,
    confidenceLabel
  }
}
