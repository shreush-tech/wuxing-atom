import {computeClinicalState} from '../src/clinical/engine'
import {symptoms} from '../src/clinical/symptoms'
import {patterns} from '../src/clinical/patterns'
import {runConsistencyGuards} from '../src/clinical/consistencyGuards'

function assert(cond:any,msg:string){if(!cond)throw new Error(msg)}
const ids=symptoms.map(x=>x.id)
const patternIds=new Set(patterns.map(x=>x.id))
let failures:any[]=[]
let tensionRuns=0
let strongTensions=0
let safetyBlocked=0
let eligible=0

function randomAnswer(){
  const r=Math.random()
  if(r<.15)return 'yes' as const
  if(r<.23)return 'no' as const
  if(r<.27)return 'unknown' as const
  return undefined
}

for(let run=0;run<30000;run++){
  const selected:any={}
  for(const id of ids){
    const v=randomAnswer()
    if(v)selected[id]=v
  }
  try{
    const state=computeClinicalState(selected)
    for(const p of state.patterns){
      assert(Number.isFinite(p.raw),`nonfinite pattern raw ${p.id}`)
      assert(p.confidence>=0&&p.confidence<=1,`confidence range ${p.id}`)
      assert(patternIds.has(p.id),`unknown pattern ${p.id}`)
    }
    for(const e of Object.values(state.elements)){
      for(const v of Object.values(e)){
        assert(Number.isFinite(v)&&v>=0&&v<=1,'element metric range')
      }
    }
    const q=state.interview.nextBestQuestions
    assert(new Set(q).size===q.length,'duplicate next questions')
    assert(q.every(x=>ids.includes(x)),'unknown next question')
    for(const tension of state.diagnosticTensions){
      tensionRuns++
      if(tension.severity==='strong')strongTensions++
      assert(patternIds.has(tension.a)&&patternIds.has(tension.b),'unknown tension pattern')
      assert(tension.discriminators.every(x=>ids.includes(x)),'unknown tension discriminator')
    }
    if(!state.interview.canShowResult)safetyBlocked++
    else eligible++
  }catch(e){
    failures.push({run,error:e instanceof Error?e.message:String(e)})
    if(failures.length>=20)break
  }
}

// Targeted opposing-nature collision journeys.
const targeted=[
  {
    name:'Kidney Yin+Yang unresolved',
    answers:{five_center_heat:'yes',night_sweats:'yes',cold:'yes',cold_feet:'yes',early_morning_diarrhea:'yes',low_back:'yes'},
    expectTension:'kidney_yin_vs_yang'
  },
  {
    name:'Lung external heat+cold unresolved',
    answers:{yellow_phlegm:'yes',sore_throat:'yes',clear_runny_nose:'yes',strong_aversion_cold:'yes',thirst:'yes'},
    expectTension:'lung_wind_heat_vs_cold'
  },
  {
    name:'Large Intestine heat+cold unresolved',
    answers:{burning_stool:'yes',foul_stool:'yes',watery_stool:'yes',worse_cold:'yes',diarrhea:'yes'},
    expectTension:'large_intestine_heat_vs_cold'
  }
]
const targetedResults=[]
for(const x of targeted){
  const state=computeClinicalState(x.answers as any)
  const tension=state.diagnosticTensions.find(t=>t.id===x.expectTension)
  targetedResults.push({
    name:x.name,
    pass:!!tension,
    tension:tension?.id||null,
    canShowResult:state.interview.canShowResult,
    nextQuestions:state.interview.nextBestQuestions
  })
}

// Consistency guards remain diagnostic aids; inspect targeted isolation.
const guardSamples=[
  {name:'isolated bitter taste',answers:{bitter_taste:'yes'}},
  {name:'bitter taste with liver context',answers:{bitter_taste:'yes',red_eyes:'yes',irritable:'yes'}},
  {name:'mouth ulcer isolated',answers:{mouth_ulcers:'yes'}},
]
const guards=guardSamples.map(x=>({
  name:x.name,
  results:runConsistencyGuards(x.answers as any).map(g=>({id:g.id,ok:g.ok}))
}))

console.log(JSON.stringify({
  version:'0.89-engine-fuzz',
  randomRuns:30000,
  failures,
  tensionOccurrences:tensionRuns,
  strongTensionOccurrences:strongTensions,
  nonEligibleRuns:safetyBlocked,
  eligibleRuns:eligible,
  targetedResults,
  guardSamples:guards
},null,2))
