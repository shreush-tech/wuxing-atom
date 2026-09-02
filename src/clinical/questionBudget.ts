export const QUESTION_BUDGET={
  opening:1,
  firstConstellation:4,
  defaultRefinement:3,
  softMaximumBeforeResult:9,
  hardMaximumWithoutUserRefine:12
} as const

export function interviewStage(answered:number){
 if(answered<=1)return 'starting'
 if(answered<6)return 'forming'
 if(answered<QUESTION_BUDGET.softMaximumBeforeResult)return 'enough_for_first_read'
 return 'result_ready'
}
