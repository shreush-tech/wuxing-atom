export const experienceFlowPolicy={
  primarySequence:[
    'interactive-atom',
    'symptom-interview',
    'map-reveal',
    'explanation',
    'acupoints-and-tuina',
    'consultation',
    'contact'
  ],
  onePrimaryResultSurface:true,
  diagnosisBeforeEducation:true,
  practicalContentAfterExplanation:true,
  contactAlwaysLast:true,
  developerToolsHiddenByQuery:true
} as const
