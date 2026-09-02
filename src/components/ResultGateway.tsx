import { useClinical } from '../clinical/store'

export function ResultGateway(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null

  const go=()=>document.getElementById('resultado')?.scrollIntoView({behavior:'smooth',block:'start'})
  const refine=()=>document.getElementById('adaptive-refine')?.scrollIntoView({behavior:'smooth',block:'center'})
  const initial=clinical.interview.readingReadiness==='initial'

  return <div className={`result-gateway ${initial?'initial':''}`}>
    <span>{initial?'Seu mapa já tem uma primeira forma':'Seu mapa está pronto para uma primeira leitura'}</span>
    <strong>{initial?'Quer ver agora ou diferenciar melhor?':'Veja o que apareceu — e refine se quiser.'}</strong>
    <div className="result-gateway-actions">
      <button type="button" className="primary" onClick={go}>Ver meu mapa agora</button>
      <button type="button" className="secondary" onClick={refine}>Refinar com +3 perguntas</button>
    </div>
    <small>Você não precisa acumular muitos sintomas. A leitura mostra o grau de sustentação das respostas atuais.</small>
  </div>
}
