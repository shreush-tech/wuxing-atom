import {patterns} from './patterns'
import {compoundPatternRules} from './compoundPatternGraph'
import {contextualPatternRules} from './contextualPatternFamilies'

export const knowledgeGraphRegistry={
  zangFuPatterns:patterns.map(p=>({id:p.id,label:p.label,scope:'zang-fu' as const})),
  compoundPatterns:compoundPatternRules.map(p=>({id:p.id,label:p.label,scope:'compound' as const})),
  contextualPatterns:contextualPatternRules.map(p=>({id:p.id,label:p.label,scope:'contextual' as const})),
}

export const knowledgeGraphCounts={
  zangFu:knowledgeGraphRegistry.zangFuPatterns.length,
  compound:knowledgeGraphRegistry.compoundPatterns.length,
  contextual:knowledgeGraphRegistry.contextualPatterns.length,
  total:knowledgeGraphRegistry.zangFuPatterns.length+
        knowledgeGraphRegistry.compoundPatterns.length+
        knowledgeGraphRegistry.contextualPatterns.length
}
