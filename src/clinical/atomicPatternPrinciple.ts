/**
 * FUNDAMENTAL CLINICAL RULE — v0.91
 * PATTERNS REMAIN ATOMIC.
 *
 * Physiopathological relationships explain how independently supported patterns
 * can coexist. They NEVER manufacture a new diagnostic pattern.
 *
 * Traditional knowledge may explain that Kidney Yin/Yang are foundational roots,
 * deficient Yin may fail to restrain Yang/Heat, and persistent Heat/Fire may
 * consume Yin, fluids and Blood/Xue. Still, EVERY pattern requires its OWN
 * symptom evidence.
 *
 * Relationships may prioritize questions and explain root/branch logic.
 * Relationships may NOT add/subtract scores, create compound IDs, or block a
 * result merely because patterns coexist.
 */
export const ATOMIC_PATTERN_PRINCIPLE=Object.freeze({
  relationshipsCreatePatterns:false,
  relationshipsModifyPatternScores:false,
  coexistenceAllowed:true,
  eachPatternRequiresOwnEvidence:true
})
