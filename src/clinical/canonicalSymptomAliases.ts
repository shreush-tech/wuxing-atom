export const canonicalSymptomAliases:Record<string,string>={
  insomnia:'poor_sleep',
  red_face:'red_face_eyes',
  heavy_head:'head_heavy',
  smelly_diarrhea:'smelly_diarrhea_mucus',
  diffuse_red_skin:'very_red_skin',
  agitated:'restless',
  burning_pain:'burning_skin',
  warmth_better:'better_warmth',
  postmeal:'worse_after_meals'
}

export function normalizeSymptomId(id:string){
  return canonicalSymptomAliases[id] ?? id
}
