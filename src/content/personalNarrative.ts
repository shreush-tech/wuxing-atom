import { symptoms } from '../clinical/symptoms'
import type { ClinicalState } from '../clinical/types'

const humanPattern:Record<string,string>={
  spleen_qi:'uma tendência de fraqueza digestiva na linguagem da Medicina Chinesa',
  spleen_yang:'uma tendência digestiva associada a frio e menor capacidade de transformação',
  liver_spleen:'uma relação entre tensão emocional e digestão',
  liver_stagnation:'um padrão de estagnação associado à dinâmica do Fígado',
  liver_fire:'um padrão com sinais mais intensos de calor ligados ao Fígado',
  liver_yang_rising:'uma tendência de ascensão do Yang do Fígado',
  kidney_yin:'uma tendência de deficiência de Yin do Rim',
  kidney_yang:'uma tendência de deficiência de Yang do Rim',
  lung_qi:'uma tendência de deficiência de Qi do Pulmão',
  heart_blood:'uma tendência de deficiência de Sangue do Coração',
  heart_yin:'uma tendência de deficiência de Yin do Coração',
  heart_qi:'uma tendência de deficiência de Qi do Coração',
  heart_yang:'uma tendência de deficiência de Yang do Coração',
  food_stagnation:'um agrupamento compatível com Estagnação de Alimentos',
  stomach_yin:'uma tendência de deficiência de Yin do Estômago',
  large_intestine_heat:'um agrupamento de calor e secura do Intestino Grosso'
}

export function buildPersonalNarrative(clinical:ClinicalState){
  const top=clinical.patterns[0], second=clinical.patterns[1]
  if(!top || top.raw<=0)return null
  const support=top.evidence.filter(e=>e.kind==='support'&&e.contribution>0)
    .sort((a,b)=>b.contribution-a.contribution).slice(0,4)
    .map(e=>symptoms.find(s=>s.id===e.symptomId)?.label).filter(Boolean) as string[]
  const missing:string[]=[]
  const phrase=humanPattern[top.id]||'um padrão tradicional que merece ser explorado'
  const opening=clinical.interview.readiness==='ambiguous'
    ? `Seu mapa ainda não escolheu uma única direção. Mesmo assim, ${phrase} apareceu entre as possibilidades mais consistentes.`
    : `Seu mapa ganhou uma direção: suas respostas se aproximaram de ${phrase}.`
  const bridge=support.length
    ? `O que mais pesou nessa leitura foi a combinação de ${support.slice(0,-1).join(', ')}${support.length>1?' e ':''}${support.at(-1)}.`
    : 'A leitura surgiu da combinação das respostas, e não de um sintoma isolado.'
  const alternative=second&&second.raw>0
    ? `Uma segunda possibilidade permaneceu no mapa: ${humanPattern[second.id]||second.id}.`
    : null
  return {opening,bridge,alternative,support,missing,topId:top.id}
}
