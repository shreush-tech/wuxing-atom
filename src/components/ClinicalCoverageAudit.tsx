import {coverageMatrix} from '../clinical/coverageMatrix'
export function ClinicalCoverageAudit(){
 if(!new URLSearchParams(window.location.search).has('clinicalAudit'))return null
 return <aside className="clinical-audit">
  <strong>Clinical graph audit</strong>
  <span>Zang-Fu: {coverageMatrix.zangFuPatterns}</span>
  <span>Compostos: {coverageMatrix.compoundPatterns}</span>
  <span>Contextuais: {coverageMatrix.contextualPatterns}</span>
  <span>Total: {coverageMatrix.totalKnowledgeNodes}</span>
 </aside>
}
