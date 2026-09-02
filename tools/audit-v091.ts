import fs from 'node:fs'
const read=(p:string)=>fs.readFileSync(p,'utf8')
const principle=read('src/clinical/atomicPatternPrinciple.ts')
const compound=read('src/clinical/compoundPatternGraph.ts')
const topics=read('src/content/knowledgeTopics.ts')
const app=read('src/App.tsx')
const checks=[
 ['atomic patterns codified',principle.includes('relationshipsCreatePatterns:false')],
 ['relationships do not modify scores',principle.includes('relationshipsModifyPatternScores:false')],
 ['each pattern requires own evidence',principle.includes('eachPatternRequiresOwnEvidence:true')],
 ['old kidney combo removed',!compound.includes("id:'kidney_yin_yang_combo'")],
 ['old liver yin combo removed',!compound.includes("id:'liver_yin_yang_rising_combo'")],
 ['old liver blood combo removed',!compound.includes("id:'liver_blood_yang_rising_combo'")],
 ['five elements documented',['wood','fire','earth','metal','water'].every(x=>topics.includes(`id:'${x}'`))],
 ['yin yang documented',topics.includes("id:'yin_yang'")],
 ['qi documented',topics.includes("id:'qi'")],
 ['tao documented',topics.includes("id:'tao'")],
 ['knowledge portal mounted',app.includes('<KnowledgePortal/>')],
 ['kidney yin-yang root described',topics.includes('raiz do Yin e do Yang')],
 ['life stage explicitly symbolic',topics.includes('leitura simbólica')],
 ['qi not claimed as physical measurement',topics.includes('não como uma grandeza física mensurável')]
]
const failed=checks.filter(x=>!x[1])
console.log(JSON.stringify({version:'0.91',passed:checks.length-failed.length,total:checks.length,failed},null,2))
if(failed.length)process.exit(1)
