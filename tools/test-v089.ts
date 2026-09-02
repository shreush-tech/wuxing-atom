import {computeDiagnosticTensions,tensionQuestionPriority} from '../src/clinical/diagnosticTensions'
import {workspaceInitialState,createPatient,appendSession,patientSessions} from '../src/workspace/model'
import {sanitizeWorkspace} from '../src/workspace/integrity'
import type {PatternScore,PatternId} from '../src/clinical/types'
import type {SessionRecord,WorkspaceState} from '../src/workspace/types'

function score(id:PatternId,raw:number):PatternScore{
  return {id,raw,confidence:Math.min(1,Math.max(0,raw/8)),evidence:[]}
}
function assert(cond:any,msg:string){if(!cond)throw new Error(msg)}

const results:any[]=[]

// Kidney Yin/Yang competition should not force a result until discriminated.
{
  const scores=[
    score('kidney_yin',5.7),score('kidney_yang',5.2),
    score('spleen_qi',1)
  ]
  const selected:any={fatigue:'yes'}
  const x=computeDiagnosticTensions(scores,selected)
  assert(x[0]?.id==='kidney_yin_vs_yang','kidney tension not detected')
  assert(x[0]?.severity==='strong','kidney tension should be strong')
  assert(tensionQuestionPriority(x).includes('five_center_heat'),'yin discriminator missing')
  assert(tensionQuestionPriority(x).includes('early_morning_diarrhea'),'yang discriminator missing')
  results.push({name:'kidney yin/yang tension',pass:true,questions:tensionQuestionPriority(x)})
}

// Once thermal discriminators are answered, tension may remain as audit info but should have no pending questions.
{
  const scores=[score('kidney_yin',5.4),score('kidney_yang',5.0)]
  const selected:any={
    five_center_heat:'yes',night_sweats:'yes',small_sips:'yes',
    cold:'no',cold_feet:'no',early_morning_diarrhea:'no',clear_urine:'no'
  }
  const x=computeDiagnosticTensions(scores,selected)
  assert(x.length===1,'tension audit should remain detectable')
  assert(x[0].discriminators.length===0,'answered discriminators should be removed')
  results.push({name:'answered differential removes pending questions',pass:true})
}

// Large score gap should not create false tension.
{
  const x=computeDiagnosticTensions([score('stomach_fire',7),score('cold_invades_stomach',2)],{})
  assert(x.length===0,'false thermal tension')
  results.push({name:'large score gap suppresses false tension',pass:true})
}

// Replay-integrity stress: 25 patients x 12 sessions; sanitize must keep correct ownership/count.
{
  let state:WorkspaceState={...workspaceInitialState,role:'physician'}
  const patients=[]
  for(let p=0;p<25;p++){
    const patient=createPatient(`Paciente ${p+1}`)
    patients.push(patient)
    state={...state,patients:[...state.patients,patient],activePatientId:patient.id}
    for(let n=1;n<=12;n++){
      const now=new Date(Date.UTC(2026,0,n,p)).toISOString()
      const session:SessionRecord={
        id:crypto.randomUUID(),patientId:patient.id,number:n,occurredAt:now,
        answers:{fatigue:n%2?'yes':'no'},clinicalDiagnosisIds:[],patterns:[],
        elements:{
          wood:{activity:.1,deficiency:0,excess:0,heat:0,cold:0,stagnation:.1},
          fire:{activity:.2,deficiency:0,excess:0,heat:.1,cold:0,stagnation:0},
          earth:{activity:.3,deficiency:.2,excess:0,heat:0,cold:0,stagnation:0},
          metal:{activity:.1,deficiency:0,excess:0,heat:0,cold:0,stagnation:0},
          water:{activity:.2,deficiency:.1,excess:0,heat:0,cold:0,stagnation:0}
        },
        usedPoints:[],recommendedPointCodes:[],clinicianNote:'',
        symptomBurden:n%11,createdAt:now,updatedAt:now,
        engineVersion:'test',knowledgeVersion:'test',schemaVersion:2
      }
      state=appendSession(state,session)
    }
  }
  const sanitized=sanitizeWorkspace(state)
  assert(sanitized.patients.length===25,'patient count corrupted')
  assert(sanitized.sessions.length===300,'session count corrupted')
  for(const p of sanitized.patients){
    assert(p.sessionCount===12,`wrong session count for ${p.displayName}`)
    assert(patientSessions(sanitized.sessions,p.id).length===12,'ownership mismatch')
  }
  results.push({name:'25 patients x 12 sessions replay integrity',pass:true,sessions:sanitized.sessions.length})
}

// Historical session cannot point at another patient's visit after sanitization.
{
  const p1=createPatient('A'),p2=createPatient('B')
  const bad:any={
    ...workspaceInitialState,role:'physician',
    activePatientId:p1.id,patients:[p1,p2],sessions:[],
    viewSessionId:'foreign'
  }
  const s:any={
    id:'foreign',patientId:p2.id,number:1,occurredAt:new Date().toISOString(),
    answers:{},clinicalDiagnosisIds:[],patterns:[],
    elements:Object.fromEntries(['wood','fire','earth','metal','water'].map(x=>[x,{activity:0,deficiency:0,excess:0,heat:0,cold:0,stagnation:0}])),
    usedPoints:[],recommendedPointCodes:[],clinicianNote:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
    engineVersion:'x',knowledgeVersion:'x',schemaVersion:2
  }
  bad.sessions=[s]
  const clean=sanitizeWorkspace(bad)
  assert(clean.viewSessionId===null,'cross-patient historical replay leak')
  results.push({name:'cross-patient historical replay blocked',pass:true})
}

console.log(JSON.stringify({version:'0.89',passed:results.length,total:results.length,results},null,2))
