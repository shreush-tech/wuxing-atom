import { lowBackDifferential } from '../clinical/painDifferentials'
import { useClinical } from '../clinical/store'

const copy={
  damp_cold:'O comportamento da dor está se aproximando do agrupamento tradicional de Frio-Umidade descrito na referência.',
  damp_heat:'O comportamento da dor está se aproximando do agrupamento tradicional de Calor-Umidade descrito na referência.',
  blood_stasis:'A qualidade fixa/perfurante da dor está se aproximando do agrupamento tradicional de Estase de Sangue descrito na referência.',
}

export function LowBackDifferentialNote(){
  const {selected}=useClinical()
  if(selected.low_back!=='yes')return null
  const d=lowBackDifferential(selected)
  if(d.id==='open')return <div className="micro-note">A lombalgia ainda não formou um agrupamento tradicional suficientemente claro. Vou manter as possibilidades abertas.</div>
  return <div className="micro-note on">{copy[d.id]}</div>
}
