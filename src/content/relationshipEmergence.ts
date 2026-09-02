import type { ClinicalState } from '../clinical/types'

export type EmergenceStage='absent'|'hint'|'forming'|'supported'|'dominant'

export interface RelationshipEmergence{
  stage:EmergenceStage
  visibility:number
  flow:number
  tension:number
  label:string
  title:string
}

export function buildRelationshipEmergence(c:ClinicalState):RelationshipEmergence{
  const r=c.relationship
  if(!r)return {stage:'absent',visibility:0,flow:0,tension:0,label:'',title:''}

  // Clinical activation is inherited entirely from the existing relationship engine.
  // These values only choreograph how an already-active relation enters the scene.
  const evidenceCount=r.evidence?.length||0
  const readiness=c.interview.readiness
  const stage:EmergenceStage=
    c.interview.canShowResult?'dominant':
    evidenceCount>=3?'supported':
    evidenceCount>=2?'forming':'hint'

  const visibility={hint:.22,forming:.46,supported:.72,dominant:1,absent:0}[stage]
  const pathological=/over|control|counter|insult|克|乘|侮/i.test(`${r.label} ${r.title}`)
  return {
    stage,
    visibility,
    flow: pathological?.42+.32*visibility:.34+.48*visibility,
    tension:pathological?.18+.42*visibility:.08+.14*visibility,
    label:r.label,
    title:r.title
  }
}
