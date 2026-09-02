import type {AnswerState,ElementId,PatternScore} from './types'
import {patterns} from './patterns'

type CandidateQuestion={symptomId:string;score:number;why:string;elements:ElementId[]}

export function planCrossSystemQuestions(
 selected:Record<string,AnswerState>,
 patternScores:PatternScore[],
 max=4
):CandidateQuestion[]{
 const live=patternScores.filter(p=>p.raw>0).sort((a,b)=>b.raw-a.raw).slice(0,10)
 const unknown=new Map<string,{yesFor:number;noFor:number;elements:Set<ElementId>}>()

 for(const p of live){
   const def=patterns.find(x=>x.id===p.id)
   if(!def)continue
   for(const e of p.evidence){
     if(selected[e.symptomId]!=null)continue
     const row=unknown.get(e.symptomId)||{yesFor:0,noFor:0,elements:new Set<ElementId>()}
     if(e.contribution>0)row.yesFor+=Math.abs(e.contribution)
     else row.noFor+=Math.abs(e.contribution)
     row.elements.add(def.element)
     unknown.set(e.symptomId,row)
   }
 }

 return [...unknown.entries()].map(([symptomId,x])=>{
   // High score for questions that separate hypotheses AND touch >1 system.
   const discrimination=Math.abs(x.yesFor-x.noFor)+Math.min(x.yesFor,x.noFor)*1.8
   const crossSystem=1+(x.elements.size-1)*.55
   return {symptomId,score:discrimination*crossSystem,why:x.elements.size>1?'diferencia padrões de sistemas diferentes':'refina o padrão principal',elements:[...x.elements]}
 }).sort((a,b)=>b.score-a.score).slice(0,max)
}
