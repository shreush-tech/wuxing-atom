import {computeClinicalState} from '../src/clinical/engine'
import {symptoms} from '../src/clinical/symptoms'
import {patterns} from '../src/clinical/patterns'

function assert(cond:any,msg:string){if(!cond)throw new Error(msg)}
const symptomIds=symptoms.map(x=>x.id)
const symptomSet=new Set(symptomIds)
const patternSet=new Set(patterns.map(x=>x.id))
let failures:any[]=[]
let coexistenceRuns=0
let rootBranchRuns=0
let differentialRuns=0
let readyWithKidneyCoexistence=0

function randomAnswer(){
  const r=Math.random()
  if(r<.14)return 'yes' as const
  if(r<.22)return 'no' as const
  if(r<.26)return 'unknown' as const
  return undefined
}

for(let run=0;run<50000;run++){
  const selected:any={}
  for(const id of symptomIds){
    const v=randomAnswer()
    if(v)selected[id]=v
  }

  try{
    const state=computeClinicalState(selected)

    for(const p of state.patterns){
      assert(patternSet.has(p.id),`unknown pattern ${p.id}`)
      assert(Number.isFinite(p.raw),`nonfinite raw ${p.id}`)
      assert(p.confidence>=0&&p.confidence<=1,`confidence out of range ${p.id}`)
    }
    for(const e of Object.values(state.elements)){
      for(const v of Object.values(e)){
        assert(Number.isFinite(v)&&v>=0&&v<=1,'element metric out of range')
      }
    }
    assert(new Set(state.interview.nextBestQuestions).size===state.interview.nextBestQuestions.length,'duplicate next question')
    assert(state.interview.nextBestQuestions.every(x=>symptomSet.has(x)),'unknown next question')

    for(const rel of state.patternRelationships){
      assert(patternSet.has(rel.a)&&patternSet.has(rel.b),'unknown relationship pattern')
      assert(rel.discriminators.every(x=>symptomSet.has(x)),'unknown relationship discriminator')
      assert(rel.bothSupported===true,'relationship emitted without both supported')
      if(rel.kind==='coexisting')coexistenceRuns++
      else if(rel.kind==='root_branch')rootBranchRuns++
      else differentialRuns++
      if(rel.id==='kidney_yin_and_yang'&&state.interview.canShowResult)readyWithKidneyCoexistence++
    }

    // Compatibility alias must remain exactly equivalent during migration.
    assert(state.diagnosticTensions.length===state.patternRelationships.length,'compatibility alias mismatch')
    for(let i=0;i<state.patternRelationships.length;i++){
      assert(state.diagnosticTensions[i].id===state.patternRelationships[i].id,'alias ordering mismatch')
    }
  }catch(e){
    failures.push({run,error:e instanceof Error?e.message:String(e)})
    if(failures.length>=20)break
  }
}

console.log(JSON.stringify({
  version:'0.90-fuzz',
  randomRuns:50000,
  symptomIds:symptomIds.length,
  uniqueSymptomIds:new Set(symptomIds).size,
  failures,
  coexistenceRelationshipsObserved:coexistenceRuns,
  rootBranchRelationshipsObserved:rootBranchRuns,
  differentialRelationshipsObserved:differentialRuns,
  readyResultsWithKidneyYinYangCoexistence:readyWithKidneyCoexistence
},null,2))
