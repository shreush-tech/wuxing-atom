import { microPaths, detectMicroPath, type MicroQuestion } from './microInterviews'
import type { AnswerState } from './types'

type Selected=Record<string,AnswerState>

export interface BranchDecision {
  pathId:string|null
  phase:'entry'|'branch'|'fallback'|'complete'
  questions:MicroQuestion[]
  reason:string
}

const answered=(s:Selected,id:string)=>s[id]==='yes'||s[id]==='no'

function pick(ids:string[], selected:Selected){
  const all=Object.values(microPaths).flatMap(p=>p.questions)
  return ids
    .map(id=>all.find(q=>q.id===id))
    .filter((q):q is MicroQuestion=>!!q)
    .filter(q=>!answered(selected,q.id))
}

export function branchDecision(selected:Selected):BranchDecision{
  const path=detectMicroPath(selected)
  if(!path)return {pathId:null,phase:'fallback',questions:[],reason:'Nenhuma queixa principal reconhecida.'}

  const unanswered=path.questions.filter(q=>!answered(selected,q.id))
  const yes=(id:string)=>selected[id]==='yes'

  // Each path has only a shallow branch. Maximum depth: entry -> branch -> fallback.
  if(path.id==='digestion'){
    if(!answered(selected,'worse_after_meals') || !answered(selected,'worse_stress')){
      return {pathId:path.id,phase:'entry',questions:pick(['worse_after_meals','worse_stress'],selected).slice(0,2),reason:'Primeiro diferenciamos relação com alimentação e estresse.'}
    }
    if(yes('worse_stress')){
      return {pathId:path.id,phase:'branch',questions:pick(['better_after_bm','gas'],selected).slice(0,2),reason:'Como o estresse piora o quadro, buscamos sinais digestivos relacionais.'}
    }
    if(yes('worse_after_meals')){
      return {pathId:path.id,phase:'branch',questions:pick(['poor_appetite','worse_raw_cold_food'],selected).slice(0,2),reason:'Como há piora após comer, diferenciamos fraqueza digestiva e sensibilidade a frio/cru.'}
    }
  }

  if(path.id==='sleep'){
    if(!answered(selected,'difficulty_falling_asleep') || !answered(selected,'frequent_waking')){
      return {pathId:path.id,phase:'entry',questions:pick(['difficulty_falling_asleep','frequent_waking'],selected).slice(0,2),reason:'Primeiro identificamos a arquitetura principal do sono.'}
    }
    if(yes('difficulty_falling_asleep')){
      return {pathId:path.id,phase:'branch',questions:pick(['palpitations','night_sweats'],selected).slice(0,2),reason:'Dificuldade para iniciar o sono pede diferenciação entre sinais de Sangue/Qi e Yin-Calor.'}
    }
    if(yes('frequent_waking')){
      return {pathId:path.id,phase:'branch',questions:pick(['dream_disturbed','waking_1_3'],selected).slice(0,2),reason:'Despertares noturnos são refinados pelo padrão dos sonhos e horário.'}
    }
  }

  if(path.id==='headache'){
    if(!answered(selected,'temporal_headache') || !answered(selected,'dizziness')){
      return {pathId:path.id,phase:'entry',questions:pick(['temporal_headache','dizziness'],selected).slice(0,2),reason:'Primeiro localizamos a dor e verificamos tontura associada.'}
    }
    if(yes('temporal_headache')){
      return {pathId:path.id,phase:'branch',questions:pick(['red_face_eyes','bitter_taste'],selected).slice(0,2),reason:'Cefaleia temporal pede diferenciação entre ascensão de Yang e sinais mais intensos de Fogo.'}
    }
  }

  if(path.id==='low_back'){
    if(!answered(selected,'low_back_cold_heavy') || !answered(selected,'fixed_piercing_back')){
      return {pathId:path.id,phase:'entry',questions:pick(['low_back_cold_heavy','fixed_piercing_back'],selected).slice(0,2),reason:'Primeiro diferenciamos peso/frio de dor fixa ou perfurante.'}
    }
    if(yes('low_back_cold_heavy')){
      return {pathId:path.id,phase:'branch',questions:pick(['worse_cold_rain','better_warmth'],selected).slice(0,2),reason:'O comportamento frio/pesado é refinado pela relação com clima e calor.'}
    }
    if(yes('fixed_piercing_back')){
      return {pathId:path.id,phase:'branch',questions:pick(['worse_pressure','worse_evening'],selected).slice(0,2),reason:'Dor fixa/perfurante é refinada por pressão e horário.'}
    }
  }

  return {
    pathId:path.id,
    phase:unanswered.length?'fallback':'complete',
    questions:unanswered.slice(0,2),
    reason:unanswered.length?'Sem um ramo dominante, seguimos pelas próximas duas perguntas mais úteis do caminho.':'Microentrevista concluída.'
  }
}
