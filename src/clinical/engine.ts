import { patterns } from './patterns'
import { symptoms } from './symptoms'
import { scoreBookRulesV2 } from './bookRulesV2'
import { chooseNextQuestions, computeReadiness } from './adaptiveInterview'
import { computeSafety, stripSafetyOnlyAnswers } from './safetyGate'
import { normalizeSymptomId } from './canonicalSymptomAliases'
import { complaintOverlays } from './complaintRuleOverlays'
import { scoreHallmarks } from './hallmarkDiscriminators'
import { scoreAuthorTranscriptRules } from './authorTranscriptRules'
import { selectMultiSystemDiagnoses, flattenActivePatterns } from './multiSystemDifferential'
import { scoreContextualPatterns } from './contextualPatternFamilies'
import { resolveClinicalContexts } from './clinicalContext'
import {computePatternRelationships,relationshipQuestionPriority} from './patternRelationships'
import type { AnswerState, ClinicalState, ElementId, ElementVisualState, PatternId, PatternScore, RelationshipState } from './types'

const emptyElement=():ElementVisualState=>({activity:0,deficiency:0,excess:0,heat:0,cold:0,stagnation:0})
const clamp01=(v:number)=>Math.max(0,Math.min(1,v))

export function computeClinicalState(selected:Record<string,AnswerState>):ClinicalState{
  // Normalize legacy/colloquial IDs before both safety and traditional scoring.
  const normalizedSelected=Object.fromEntries(
    Object.entries(selected).map(([id,value])=>[normalizeSymptomId(id),value])
  ) as Record<string,AnswerState>

  // Safety is evaluated before any traditional-pattern scoring.
  const safety=computeSafety(normalizedSelected)
  const clinicalSelected=stripSafetyOnlyAnswers(normalizedSelected)

  const scores=patterns.reduce((acc,p)=>{
    acc[p.id]={id:p.id,raw:0,confidence:0,evidence:[]}
    return acc
  },{} as Record<PatternId,PatternScore>)

  for(const s of symptoms){
    const answer=clinicalSelected[s.id]
    if(answer!=='yes' && answer!=='no')continue

    if(answer==='yes'){
      for(const [patternId,w] of Object.entries(s.weights||{})){
        const p=scores[patternId as PatternId]
        if(!p)continue
        p.raw+=w||0
        p.evidence.push({symptomId:s.id,contribution:w||0,kind:'support'})
      }
      for(const [patternId,w] of Object.entries(s.contradicts||{})){
        const p=scores[patternId as PatternId]
        if(!p)continue
        p.raw-=w||0
        p.evidence.push({symptomId:s.id,contribution:-(w||0),kind:'contradiction'})
      }
    }else{
      for(const [patternId,w] of Object.entries(s.weights||{})){
        if((w||0)>=3){
          const p=scores[patternId as PatternId]
          if(!p)continue
          p.raw-=.45
          p.evidence.push({symptomId:s.id,contribution:-.45,kind:'contradiction'})
        }
      }
    }
  }

  // Merge book-grounded v2 rules. Avoid double-counting identical evidence already present in symptoms.ts.
  for(const addon of scoreBookRulesV2(clinicalSelected)){
    const p=scores[addon.id]
    if(!p)continue
    for(const ev of addon.evidence){
      const exists=p.evidence.some(x=>x.symptomId===ev.symptomId && x.kind===ev.kind)
      if(!exists){
        p.raw+=ev.weight
        p.evidence.push({symptomId:ev.symptomId,contribution:ev.weight,kind:ev.kind})
      }
    }
  }



  // Structured lesson material enriches anamnesis and differentiation.
  // It never deletes or silently overrides book-grounded evidence.
  for(const addon of scoreAuthorTranscriptRules(clinicalSelected)){
    const p=scores[addon.id]
    if(!p)continue
    for(const ev of addon.evidence){
      const exists=p.evidence.some(x=>x.symptomId===ev.symptomId && x.kind==='support')
      if(!exists){
        p.raw+=ev.weight
        p.evidence.push({symptomId:ev.symptomId,contribution:ev.weight,kind:'support'})
      }
    }
  }

  // Complaint-specific overlays: same source discipline, different acquisition path.
  for(const overlay of complaintOverlays(clinicalSelected)){
    const p=scores[overlay.id]
    if(!p)continue
    for(const ev of overlay.evidence){
      const exists=p.evidence.some(x=>x.symptomId===ev.symptomId && x.kind===ev.kind)
      if(!exists){
        p.raw+=ev.contribution
        p.evidence.push(ev)
      }
    }
  }

  // Hallmark/discriminator rules: strong clues, never exclusive diagnoses.
  for(const [patternId,items] of scoreHallmarks(clinicalSelected)){
    const p=scores[patternId]
    if(!p)continue
    for(const ev of items){
      const exists=p.evidence.some(x=>x.symptomId===ev.symptomId && x.kind==='support')
      if(!exists){
        p.raw+=ev.weight
        p.evidence.push({symptomId:ev.symptomId,contribution:ev.weight,kind:'support'})
      }
    }
  }

  const patternList=Object.values(scores)
    .map(p=>({...p,confidence:clamp01(Math.max(0,p.raw)/8)}))
    .sort((a,b)=>b.raw-a.raw)

  const elements:Record<ElementId,ElementVisualState>={
    wood:emptyElement(),fire:emptyElement(),earth:emptyElement(),metal:emptyElement(),water:emptyElement()
  }

  for(const score of patternList){
    if(score.raw<=0)continue
    const def=patterns.find(p=>p.id===score.id)
    if(!def)continue
    const intensity=score.confidence
    const e=elements[def.element]
    e.activity=Math.max(e.activity,intensity)
    e.deficiency=Math.max(e.deficiency,(def.nature.deficiency||0)*intensity)
    e.excess=Math.max(e.excess,(def.nature.excess||0)*intensity)
    e.heat=Math.max(e.heat,(def.nature.heat||0)*intensity)
    e.cold=Math.max(e.cold,(def.nature.cold||0)*intensity)
    e.stagnation=Math.max(e.stagnation,(def.nature.stagnation||0)*intensity)
  }

  const has=(id:string)=>clinicalSelected[id]==='yes'
  let relationship:RelationshipState|null=null

  const liverSpleen=scores.liver_spleen
  if(liverSpleen.raw>=6 && (has('stress_bowel')||has('better_after_bm'))){
    relationship={
      id:'wood_earth',source:'wood',target:'earth',type:'overacting',
      strength:clamp01(liverSpleen.raw/10),confidence:clamp01(liverSpleen.raw/8),
      label:'木 → 土',title:'Madeira e Terra em interação',
      explanation:'Suas respostas formaram um conjunto tradicional em que tensão ou fatores emocionais acompanham alterações digestivas.',
      evidence:liverSpleen.evidence.filter(e=>e.kind==='support').map(e=>e.symptomId)
    }
  }

  const kr=scores.kidney_receive_lung
  if(!relationship && kr.raw>=6 && has('short_breath') && (has('difficulty_inhaling')||has('low_back')||has('clear_urine'))){
    relationship={
      id:'metal_water',source:'metal',target:'water',type:'functional',
      strength:clamp01(kr.raw/10),confidence:clamp01(kr.raw/8),
      label:'金 ↔ 水',title:'Metal e Água em interação',
      explanation:'O conjunto aproxima manifestações respiratórias e sinais tradicionalmente associados ao Rim.',
      evidence:kr.evidence.filter(e=>e.kind==='support').map(e=>e.symptomId)
    }
  }

  const systemDiagnoses=selectMultiSystemDiagnoses(patternList)
  const activePatterns=flattenActivePatterns(systemDiagnoses)
  // Atomic-pattern principle: relationships explain coexistence but never manufacture a compound diagnosis.
  const compoundDiagnoses=[]
  const clinicalContexts=resolveClinicalContexts(clinicalSelected)
  const contextualDiagnoses=scoreContextualPatterns(clinicalSelected,clinicalContexts)

  const r=computeReadiness(clinicalSelected,patternList)
  const patternRelationships=computePatternRelationships(patternList,clinicalSelected)
  const relationshipQuestions=relationshipQuestionPriority(patternRelationships)
  const ordinaryQuestions=chooseNextQuestions(clinicalSelected,patternList,6)
  const nextBestQuestions=[...new Set([...relationshipQuestions,...ordinaryQuestions])].slice(0,4)
  const interview={
    answeredCount:r.answered,
    yesCount:r.yes,
    informationLevel:r.info,
    readiness:r.readiness,
    readingReadiness:r.readingReadiness,
    leadingPatternId:patternList[0]?.raw>0?patternList[0].id:null,
    runnerUpPatternId:patternList[1]?.raw>0?patternList[1].id:null,
    separation:r.separation,
    nextBestQuestions,
    canShowResult:safety.canContinue && (r.canShowResult || !!relationship),
    rationale:r.rationale
  }

  return {selected,patternRelationships,diagnosticTensions:patternRelationships,patterns:patternList,systemDiagnoses,activePatterns,compoundDiagnoses,contextualDiagnoses,elements,relationship,interview}
}
