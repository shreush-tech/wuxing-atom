/*
These are book-grounded symptom clusters used to seed complaint-specific lay questioning.
They do not include specialist examination findings.
*/
export const bookComplaintClusters={
  low_back:{
    coldDamp:['low_back','cold','better_warmth','clear_urine'],
    dampHeat:['low_back','thirst','dark_urine','diarrhea'],
    bloodStasis:['low_back','history_trauma','numbness'],
    liverQi:['low_back','stress','headache'],
    spleenQiDamp:['low_back','diarrhea','fatigue'],
    kidneyYang:['low_back','cold_limbs','short_breath','better_warmth'],
    kidneyYin:['low_back','night_sweats','dry_mouth']
  },
  digestion:{
    liverSpleen:['stress_bowel','better_after_bm','bloating','gas','diarrhea'],
    spleenQi:['bloating','poor_appetite','fatigue','diarrhea'],
    spleenYang:['bloating','cold_limbs','fatigue','diarrhea'],
    stomachYin:['burning_stomach','dry_mouth','dry_stool','night_sweats']
  }
} as const
