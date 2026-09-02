import { symptoms } from './symptoms'
import { bookRulesV2 } from './bookRulesV2'
import type { AnswerState, PatternId, PatternScore, SymptomId } from './types'

type Selected=Record<string,AnswerState>

function weightFor(patternId:PatternId,symptomId:SymptomId){
  const s=symptoms.find(x=>x.id===symptomId)
  let w=s?.weights?.[patternId]||0
  const r=bookRulesV2.find(x=>x.id===patternId)
  const rw=r?.support.find(([id])=>id===symptomId)?.[1]||0
  return Math.max(w,rw)
}

export function chooseNextQuestions(selected:Selected,ranked:PatternScore[],limit=4):SymptomId[]{
  const lead=ranked[0], second=ranked[1], third=ranked[2]
  const contenders=[lead,second,third].filter(Boolean) as PatternScore[]
  if(!contenders.length)return []

  const candidates=symptoms.filter(s=>selected[s.id]===undefined || selected[s.id]==='unknown')
  const scored=candidates.map(s=>{
    const ws=contenders.map(p=>weightFor(p.id,s.id))
    const max=Math.max(...ws,0)
    const min=Math.min(...ws,0)
    const spread=max-min
    const relevance=ws.reduce((a,b)=>a+b,0)
    const leadBias=lead?weightFor(lead.id,s.id):0
    const askedPenalty=selected[s.id]==='unknown' ? .45 : 1
    const value=(spread*2.2 + relevance*.65 + leadBias*.35)*askedPenalty
    return {id:s.id,value}
  }).filter(x=>x.value>0)
    .sort((a,b)=>b.value-a.value)

  return [...new Set(scored.map(x=>x.id))].slice(0,limit)
}

export function computeReadiness(selected:Selected,ranked:PatternScore[]){
  const answered=Object.values(selected).filter(v=>v==='yes'||v==='no').length
  const yes=Object.values(selected).filter(v=>v==='yes').length
  const lead=ranked[0]
  const second=ranked[1]
  const leadRaw=Math.max(0,lead?.raw||0)
  const separation=leadRaw-(second?.raw||0)
  const info=Math.min(1,(answered*.08)+(yes*.06)+(leadRaw*.045))

  let readiness:'starting'|'forming'|'refine'|'ready'|'ambiguous'='starting'
  let readingReadiness:'insufficient'|'initial'|'refinable'|'well_supported'='insufficient'
  let rationale='Estamos começando a entender seu mapa.'
  let canShowResult=false

  // Saída precoce: qualidade da evidência importa mais que quantidade bruta de sintomas.
  // Uma queixa + um discriminador coerente já pode sustentar uma leitura inicial,
  // sem transformar essa leitura em certeza diagnóstica.
  const hasInitialSignal=(yes>=1 && answered>=2 && leadRaw>=3) || (yes>=2 && leadRaw>=3)
  const hasRefinableSignal=leadRaw>=4 && answered>=2
  const hasStrongSignal=(leadRaw>=6 && answered>=4) || (leadRaw>=7 && separation>=3)

  if(answered>=2 || yes>=2){
    readiness='forming'
    rationale='Seu mapa está ganhando forma.'
  }

  if(hasInitialSignal){
    readingReadiness='initial'
    canShowResult=true
    rationale='Já há sinais suficientes para uma primeira leitura. Você pode ver o mapa agora ou refiná-lo.'
  }

  if(hasRefinableSignal){
    readingReadiness='refinable'
    readiness='refine'
    canShowResult=true
    rationale='Já existe uma leitura inicial útil; algumas perguntas podem diferenciá-la melhor.'
  }

  if(leadRaw>=5 && separation<2){
    readiness='ambiguous'
    readingReadiness=hasInitialSignal?'refinable':'initial'
    canShowResult=hasInitialSignal
    rationale='Há sinais úteis, mas duas ou mais possibilidades tradicionais continuam próximas.'
  }

  if(hasStrongSignal){
    readiness='ready'
    readingReadiness='well_supported'
    rationale='Há vários sinais convergentes para uma leitura mais bem sustentada.'
    canShowResult=true
  }

  return {answered,yes,separation,info,readiness,readingReadiness,rationale,canShowResult}
}
