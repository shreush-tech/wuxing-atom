import type { ClinicalState, PatternId } from '../clinical/types'
import { questions } from '../clinical/questions'

export interface DifferentialFocus{
  close:boolean
  first?:PatternId
  second?:PatternId
  questionId?:string
  reason?:string
}

export function buildDifferentialFocus(c:ClinicalState):DifferentialFocus{
  const active=c.patterns.filter(p=>p.raw>0)
  const a=active[0], b=active[1]
  if(!a||!b)return {close:false}
  const gap=Math.abs(a.raw-b.raw)
  const close=gap<=Math.max(2,Math.round(Math.max(a.raw,b.raw)*.22))
  if(!close)return {close:false,first:a.id,second:b.id}

  // Existing adaptive engine remains authoritative.
  // We surface its highest-priority unanswered question as the "tie-breaker";
  // this layer does not invent a new symptom-pattern association.
  const qid=c.interview.nextBestQuestions?.[0]
  const q=questions.find(x=>qid ? (x.options.includes(qid) || x.when.includes(qid)) : false)
  return {
    close:true,
    first:a.id,
    second:b.id,
    questionId:qid,
    reason:q?'Esta pergunta foi priorizada porque o motor atual a considera útil para separar as hipóteses que permanecem próximas.':
      'As duas leituras continuam próximas e ainda não há uma pergunta discriminativa disponível.'
  }
}
