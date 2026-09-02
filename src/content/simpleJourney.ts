import type { ClinicalState } from '../clinical/types'

export function simpleJourneyCopy(c:ClinicalState){
  if(c.interview.canShowResult) return {title:'Seu mapa está pronto', detail:'Veja sua primeira leitura.'}
  const n=c.interview.informationLevel||0
  if(n<2) return {title:'Conte o que você sente', detail:'Escolha o que mais incomoda você.'}
  if(n<5) return {title:'Só mais um pouco', detail:'Algumas respostas ajudam a diferenciar o seu mapa.'}
  return {title:'Seu mapa está tomando forma', detail:'Estamos chegando a uma primeira leitura.'}
}
