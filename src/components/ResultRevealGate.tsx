import {useClinical} from '../clinical/store'
import {diagnosticRevealState} from '../content/diagnosticRevealState'

export function ResultRevealGate(){
  const {clinical}=useClinical()
  const s=diagnosticRevealState(clinical)

  if(!s.canReveal)return null
  return <div className="result-reveal-gate" aria-live="polite">
    <p>Já temos sinais suficientes para uma primeira leitura.</p>
    <a href="#resultado" className="result-reveal-link">Ver meu equilíbrio</a>
  </div>
}
