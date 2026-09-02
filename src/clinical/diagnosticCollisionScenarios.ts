/**
 * Structural collision scenarios.
 * These do not add clinical associations or weights.
 * They assert how already-supported diagnoses must coexist in the product.
 */
export const diagnosticCollisionScenarios=[
  {
    id:'same_element_two_patterns',
    expectation:'Two independently supported patterns from the same element may remain active; do not force a winner solely because they share an element.'
  },
  {
    id:'different_elements_coexist',
    expectation:'Supported patterns from different elements may coexist without automatically creating a Wu Xing relationship.'
  },
  {
    id:'relationship_requires_evidence',
    expectation:'A relationship halo requires explicit relational evidence in addition to active source and target systems.'
  },
  {
    id:'contradiction_weakens_not_erases',
    expectation:'Contradictory answers reduce support for a hypothesis; they do not automatically erase other independent evidence.'
  },
  {
    id:'lay_result_progressive_disclosure',
    expectation:'The result emphasizes the most salient map first and progressively discloses additional supported patterns.'
  }
] as const
