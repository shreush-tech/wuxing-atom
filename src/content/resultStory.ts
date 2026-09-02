import { symptoms } from '../clinical/symptoms'
import type { ClinicalState } from '../clinical/types'
import { patternLabels, relationshipLabels } from './resultLabels'

const symptomLabel=(id:string)=>symptoms.find(s=>s.id===id)?.label||id

export function resultStory(c:ClinicalState){
  const top=c.patterns[0], runner=c.patterns[1]
  if(!top || top.raw<=0)return null
  const evidence=top.evidence
    .filter(e=>e.kind==='support'&&e.contribution>0)
    .sort((a,b)=>b.contribution-a.contribution)
    .slice(0,5)
    .map(e=>({label:symptomLabel(e.symptomId),weight:e.contribution}))
  const contradictions=top.evidence
    .filter(e=>e.kind==='contradiction')
    .slice(0,3)
    .map(e=>symptomLabel(e.symptomId))
  const rel=c.relationship?relationshipLabels[c.relationship.id]:null
  const topLabel=patternLabels[top.id]||{short:top.id,traditional:top.id}
  const runnerLabel=runner&&runner.raw>0?(patternLabels[runner.id]||{short:runner.id,traditional:runner.id}):null
  const confidence=c.interview.readiness==='ready'?'bem sustentado':
    c.interview.readiness==='ambiguous'?'ainda aberto':'ganhando consistência'
  return {top,runner,evidence,contradictions,rel,topLabel,runnerLabel,confidence}
}
