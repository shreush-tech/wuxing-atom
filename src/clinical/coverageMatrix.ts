import {patterns} from './patterns'
import {compoundPatternRules} from './compoundPatternGraph'
import {contextualPatternRules} from './contextualPatternFamilies'

export const complaintDomains=[
 'respiratory','digestive','neurological','cardiovascular','mental',
 'pain','women','men','genitourinary','skin','cancer-support'
] as const

export const coverageMatrix={
 zangFuPatterns:patterns.length,
 compoundPatterns:compoundPatternRules.length,
 contextualPatterns:contextualPatternRules.length,
 contextualFamilies:[...new Set(contextualPatternRules.map(x=>x.family))],
 complaintDomains,
 totalKnowledgeNodes:patterns.length+compoundPatternRules.length+contextualPatternRules.length
}
