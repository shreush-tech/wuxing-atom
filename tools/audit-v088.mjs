import fs from 'node:fs'
import path from 'node:path'

const root=path.resolve(process.cwd())
const read=p=>fs.readFileSync(path.join(root,p),'utf8')
const checks=[]
const ok=(name,pass,detail='')=>checks.push({name,pass,detail})

const app=read('src/App.tsx')
const notebook=read('src/workspace/SessionNotebook.tsx')
const rail=read('src/workspace/PatientRail.tsx')
const scene=read('src/three/Scene.tsx')
const model=read('src/workspace/model.ts')
const repo=read('src/workspace/repository.ts')
const integrity=read('src/workspace/integrity.ts')
const points=read('src/workspace/acupointCodes.ts')
const bookRules=read('src/clinical/bookRulesV2.ts')
const safety=read('src/clinical/safetyGate.ts')
const education=read('src/components/EducationSection.tsx')

ok('Workspace remains integrated',app.includes('<WorkspaceProvider><ClinicalProvider>'))
ok('Patient rail remains discreetly mounted',app.includes('<PatientRail/>'))
ok('Longitudinal timeline mounted',app.includes('<PatientTimeline/>'))
ok('Map-change summary mounted',app.includes('<MapChangeSummary/>'))
ok('Professional session notebook mounted',app.includes('<SessionNotebook/>'))

const railUseMemo=rail.indexOf('const list=useMemo')
const railReturn=rail.indexOf("if(state.role==='patient')return null")
ok('PatientRail hooks execute before conditional return',railUseMemo>=0&&railUseMemo<railReturn)

const noteUseMemo=notebook.indexOf('const sessions=useMemo')
const noteReturn=notebook.indexOf("if(state.role==='patient'||!activePatient)return null")
ok('SessionNotebook hooks execute before conditional return',noteUseMemo>=0&&noteUseMemo<noteReturn)

ok('Drafts are isolated by patient id',notebook.includes('drafts[patientId]')&&notebook.includes('[patientId]:'))
ok('Empty session validation present',notebook.includes('A sessão está vazia'))
ok('Invalid point codes block save',notebook.includes('parsed.invalid.length'))
ok('Clinician point suggestions require result readiness',notebook.includes('clinical.interview.canShowResult'))
ok('Clinician point suggestions use confidence gate',notebook.includes('p.confidence>=0.35'))
ok('Clinician notes are saved from current patient draft',notebook.includes('clinicianNote:draft.note.trim()'))
ok('Used points preserve canonical and localized code',notebook.includes('code:point.canonical')&&notebook.includes('displayCode:point.displayPtBr'))
ok('Session stores engine/knowledge/schema versions',notebook.includes('engineVersion:ENGINE_VERSION')&&notebook.includes('schemaVersion:2'))

ok('Portuguese point aliases normalize to canonical prefixes',points.includes("F:'LV'")&&points.includes("IG:'LI'")&&points.includes("BP:'SP'"))
ok('Duplicate Portuguese/English point aliases can deduplicate',points.includes('seen.has(p.canonical)'))

ok('Patient mode clears clinician identity',model.includes("role,activePatientId:null"))
ok('Default repository remains memory-only',repo.includes('MemoryWorkspaceRepository'))
ok('Persistent demo data is sanitized on load',repo.includes('sanitizeWorkspace(JSON.parse(raw))'))
ok('Corrupt workspace entries are filtered',integrity.includes('safePatient')&&integrity.includes('safeSession'))
ok('Patient session counts are recomputed from sessions',integrity.includes('countByPatient'))

ok('WebGL context loss triggers graceful fallback',scene.includes('webglcontextlost')&&scene.includes('setRuntimeFailed(true)'))
ok('Transmission quality remains tiered',scene.includes('transmissionResolutionScale'))
ok('Fire apex implementation preserved',read('src/three/ElementBody.tsx').includes("fire:new THREE.Vector3(0,2.78"))

ok('Book minHits cap now affects evidence contributions',bookRules.includes('scale=cap/positive'))
ok('Safety still blocks chest red flags',safety.includes('chest_pain_radiates_arm'))
ok('Safety still blocks facial weakness',safety.includes('facial_weakness'))
ok('No patient-facing interactions-in-evidence label',!education.includes('Interações em evidência'))
ok('Patient acupressure module is not used for clinician suggestions',!notebook.includes('practicalRecommendations')&&!notebook.includes('acupressurePoints'))
ok('Mobile CSS no longer hides Student mode',!read('src/styles/app.css').includes('.role-switch button:nth-child(2){display:none}'))

const failures=checks.filter(x=>!x.pass)
console.log(JSON.stringify({version:'0.88',passed:checks.length-failures.length,total:checks.length,failures,checks},null,2))
process.exit(failures.length?1:0)
