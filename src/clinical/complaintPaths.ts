export const complaintSafetyPrompts:Record<string,string[]>={
  headache:['severe_sudden_headache','new_neuro_deficit','syncope','persistent_fever'],
  short_breath:['severe_breathlessness','severe_chest_pain','syncope','progressive_weakness'],
  low_back:['saddle_anesthesia_bladder','new_neuro_deficit','progressive_weakness','unexplained_weight_loss','persistent_fever'],
  bloating:['fever_severe_abdominal_pain','persistent_vomiting','black_bloody_stool','unexplained_weight_loss'],
  constipation:['black_bloody_stool','persistent_vomiting','fever_severe_abdominal_pain','unexplained_weight_loss'],
  diarrhea:['black_bloody_stool','persistent_fever','fever_severe_abdominal_pain','unexplained_weight_loss'],
  reflux:['severe_chest_pain','persistent_vomiting','black_bloody_stool','unexplained_weight_loss'],
  poor_sleep:[],
  fatigue:['severe_breathlessness','severe_chest_pain','syncope','unexplained_weight_loss','persistent_fever'],
  stress:[],
}
