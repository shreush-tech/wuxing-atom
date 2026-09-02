import type {AnswerState} from './types'
import {runConsistencyGuards} from './consistencyGuards'

type Scenario={
  id:string
  description:string
  selected:Record<string,AnswerState>
  expectation:string
}

export const regressionScenarios:Scenario[]=[
 {
  id:'spleen_yang_plus_liver_yang',
  description:'Coexistência Terra + Madeira',
  selected:{fatigue:'yes',loose_stools:'yes',cold_body:'yes',headache:'yes',dizziness:'yes',irritable:'yes'},
  expectation:'Manter simultaneamente hipótese de Baço Yang deficiente e Ascensão do Yang do Fígado.'
 },
 {
  id:'liver_fire_heart_fire_heart_yin',
  description:'Múltiplos padrões de Madeira e Fogo com insônia',
  selected:{poor_sleep:'yes',irritable:'yes',bitter_taste:'yes',palpitations:'yes',night_sweats:'yes',dry_mouth:'yes'},
  expectation:'Permitir múltiplos padrões e não reduzir a uma única causa.'
 },
 {
  id:'heart_kidney_disharmony',
  description:'Coração–Rim',
  selected:{palpitations:'yes',poor_sleep:'yes',night_sweats:'yes',low_back:'yes',tinnitus:'yes'},
  expectation:'Sustentar combinação Coração–Rim quando co-sinais estiverem presentes.'
 },
 {
  id:'liver_insults_lung',
  description:'Madeira insultando Metal',
  selected:{irritable:'yes',rib_pain:'yes',short_breath:'yes',cough_easy:'yes'},
  expectation:'Só mostrar relação Madeira→Metal se o cluster relacional estiver sustentado.'
 },
 {
  id:'kidney_not_receive_lung',
  description:'Rim falha em receber o Qi do Pulmão',
  selected:{short_breath:'yes',low_back:'yes',weak_knees:'yes',fatigue:'yes'},
  expectation:'Diferenciar Metal–Água de deficiência isolada do Pulmão.'
 },
 {
  id:'mouth_ulcer_collision',
  description:'Afta: Coração versus Estômago',
  selected:{mouth_ulcers:'yes',constant_hunger:'yes',bleeding_gums:'yes',acid_reflux:'yes'},
  expectation:'Favorecer Estômago/Fleuma-Fogo sem transformar afta em exclusividade de Coração.'
 },
 {
  id:'bitter_taste_collision',
  description:'Gosto amargo não exclusivo',
  selected:{bitter_taste:'yes',poor_sleep:'yes'},
  expectation:'Manter baixa confiança e pedir pergunta discriminativa adicional.'
 }
]

export function auditRegressionScenarios(){
 return regressionScenarios.map(s=>({
   id:s.id,
   description:s.description,
   guards:runConsistencyGuards(s.selected),
   expectation:s.expectation
 }))
}
