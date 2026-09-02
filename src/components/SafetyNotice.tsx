import { useClinical } from '../clinical/store'

export function SafetyNotice(){
  const {selected}=useClinical()
  const respiratory=selected.short_breath==='yes'
  const chest=selected.heart_discomfort==='yes'
  if(!respiratory && !chest)return null
  return <div className="safety-notice">
    <strong>Atenção clínica</strong>
    <p>Falta de ar ou desconforto no peito podem precisar de avaliação médica independentemente da leitura tradicional. Se forem intensos, novos ou acompanhados de piora importante, procure atendimento médico.</p>
  </div>
}
