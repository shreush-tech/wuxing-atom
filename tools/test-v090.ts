import {computeClinicalState} from '../src/clinical/engine'
import {computePatternRelationships} from '../src/clinical/patternRelationships'
import type {PatternScore,PatternId} from '../src/clinical/types'

function assert(cond:any,msg:string){if(!cond)throw new Error(msg)}
function s(id:PatternId,raw:number):PatternScore{return {id,raw,confidence:Math.min(1,raw/8),evidence:[]}}

const results:any[]=[]

{
  const rels=computePatternRelationships([s('kidney_yin',6),s('kidney_yang',5.8)],{})
  const rel=rels.find(x=>x.id==='kidney_yin_and_yang')
  assert(!!rel,'Kidney Yin+Yang coexistence relation missing')
  assert(rel?.kind==='coexisting','Kidney Yin+Yang should be coexisting')
  results.push({name:'Kidney Yin and Yang coexist',pass:true})
}

{
  const rels=computePatternRelationships([s('liver_yin',5.5),s('liver_yang_rising',5.1)],{})
  const rel=rels.find(x=>x.id==='liver_yin_with_yang_rising')
  assert(!!rel,'Liver Yin + Yang Rising root/branch relation missing')
  assert(rel?.kind==='root_branch','Liver relation should be root_branch')
  results.push({name:'Liver Yin + Yang Rising coexist as root/branch',pass:true})
}

{
  const rels=computePatternRelationships([s('liver_blood',5.2),s('liver_yang_rising',4.9)],{})
  assert(rels.some(x=>x.id==='liver_blood_with_yang_rising'),'Liver Blood + Yang Rising relation missing')
  results.push({name:'Liver Blood + Yang Rising coexist',pass:true})
}

{
  const state=computeClinicalState({
    low_back:'yes',night_sweats:'yes',five_center_heat:'yes',small_sips:'yes',
    cold_feet:'yes',early_morning_diarrhea:'yes',clear_urine:'yes',urinary_dribbling:'yes',
    fatigue:'yes'
  } as any)
  const ids=state.patterns.filter(p=>p.raw>0).map(p=>p.id)
  assert(ids.includes('kidney_yin'),'Kidney Yin not supported in coexistence journey')
  assert(ids.includes('kidney_yang'),'Kidney Yang not supported in coexistence journey')
  assert(state.patternRelationships.some(x=>x.id==='kidney_yin_and_yang'),'coexistence relation absent in engine state')
  // Important principle: coexistence itself must not be a blocking condition.
  assert(state.interview.canShowResult,'coexistence should not block an otherwise ready result')
  results.push({
    name:'Kidney coexistence survives end-to-end engine',
    pass:true,
    top:state.patterns.slice(0,5).map(p=>[p.id,p.raw]),
    canShowResult:state.interview.canShowResult
  })
}

{
  const state=computeClinicalState({
    dizziness:'yes',blurred_vision:'yes',dry_eyes:'yes',night_sweats:'yes',
    headache:'yes',irritable:'yes',red_eyes:'yes'
  } as any)
  assert(state.patterns.some(p=>p.id==='liver_yin'&&p.raw>0),'Liver Yin missing')
  assert(state.patterns.some(p=>p.id==='liver_yang_rising'&&p.raw>0),'Liver Yang Rising missing')
  assert(state.patternRelationships.some(x=>x.id==='liver_yin_with_yang_rising'),'root/branch relation missing end-to-end')
  results.push({name:'Liver root/branch survives end-to-end engine',pass:true})
}

console.log(JSON.stringify({version:'0.90',passed:results.length,total:results.length,results},null,2))
