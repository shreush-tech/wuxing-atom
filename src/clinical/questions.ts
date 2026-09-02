export interface QuestionDef {
  when: string[]
  unless?: string[]
  text: string
  options: string[]
}

export const questions: QuestionDef[] = [
  {when:['bloating'],unless:['worse_after_meals','stress_bowel','better_warmth'],text:'Quando a barriga estufada aparece, o que combina mais?',options:['worse_after_meals','stress_bowel','better_warmth','poor_appetite']},
  {when:['diarrhea'],unless:['stress_bowel','better_after_bm','undigested_stool'],text:'Sobre o intestino, o que você também percebe?',options:['stress_bowel','better_after_bm','undigested_stool','poor_appetite']},
  {when:['low_back'],unless:['cold','night_sweats','clear_urine','tinnitus'],text:'Junto da lombar, o que combina mais com você?',options:['cold','clear_urine','tinnitus','night_sweats','dry_mouth']},
  {when:['short_breath'],unless:['weak_voice','difficulty_inhaling','low_back'],text:'O que acompanha mais a falta de ar?',options:['weak_voice','difficulty_inhaling','low_back','frequent_colds','cold']},
  {when:['poor_sleep'],unless:['palpitations','night_sweats','dreams','dry_mouth'],text:'Quando o sono fica ruim, alguma destas coisas acontece?',options:['dreams','palpitations','night_sweats','dry_mouth','restlessness']},
  {when:['stress'],unless:['sighing','stress_bowel','bitter_taste'],text:'Quando você está mais tenso ou irritado, o que aparece junto?',options:['sighing','stress_bowel','bitter_taste','red_eyes','reflux']},
  {when:['headache'],unless:['bitter_taste','red_eyes','thirst'],text:'Algum destes acompanha sua dor de cabeça?',options:['bitter_taste','red_eyes','thirst','dizziness','tinnitus']},
]
