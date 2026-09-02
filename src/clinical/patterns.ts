import type { PatternDefinition } from './types'

/*
Pattern names and groupings below are grounded in the uploaded reference book.
Numeric nature values are product/rendering abstractions only.
Pulse and tongue findings are deliberately excluded from patient acquisition.
*/
export const patterns: PatternDefinition[] = [
  // EARTH — Spleen
  {id:'spleen_qi',label:'Deficiência de Qi do Baço',element:'earth',nature:{deficiency:.75}},
  {id:'spleen_yang',label:'Deficiência de Yang do Baço',element:'earth',nature:{deficiency:.88,cold:.88}},
  {id:'spleen_yin',label:'Deficiência de Yin do Baço',element:'earth',nature:{deficiency:.82,heat:.34}},
  {id:'spleen_blood',label:'Deficiência de Sangue do Baço',element:'earth',nature:{deficiency:.82}},
  {id:'spleen_qi_sinking',label:'Afundamento do Qi do Baço',element:'earth',nature:{deficiency:.88}},
  {id:'spleen_not_holding_blood',label:'Baço não contendo o Sangue',element:'earth',nature:{deficiency:.82}},
  {id:'spleen_qi_damp',label:'Deficiência de Qi do Baço com Umidade',element:'earth',nature:{deficiency:.72}},
  {id:'cold_damp_spleen',label:'Frio-Umidade invadindo o Baço',element:'earth',nature:{cold:.82,excess:.48}},

  // EARTH — Stomach
  {id:'stomach_qi',label:'Deficiência de Qi do Estômago',element:'earth',nature:{deficiency:.72}},
  {id:'stomach_yang',label:'Deficiência de Yang do Estômago',element:'earth',nature:{deficiency:.86,cold:.82}},
  {id:'stomach_yin',label:'Deficiência de Yin do Estômago',element:'earth',nature:{deficiency:.78,heat:.52}},
  {id:'stomach_fire',label:'Fogo do Estômago',element:'earth',nature:{excess:.92,heat:.96}},
  {id:'stomach_phlegm_fire',label:'Fleuma-Fogo no Estômago',element:'earth',nature:{excess:.84,heat:.90}},
  {id:'food_stagnation',label:'Retenção / Estagnação de Alimentos',element:'earth',nature:{stagnation:.88,excess:.42}},
  {id:'stomach_blood_stasis',label:'Estase de Sangue no Estômago',element:'earth',nature:{stagnation:.92,excess:.54}},
  {id:'cold_invades_stomach',label:'Frio invadindo o Estômago',element:'earth',nature:{cold:.94,excess:.66}},

  // WOOD
  {id:'liver_stagnation',label:'Estagnação do Qi do Fígado',element:'wood',nature:{stagnation:.96}},
  {id:'liver_yang_rising',label:'Ascensão do Yang do Fígado',element:'wood',nature:{excess:.72,heat:.52}},
  {id:'liver_fire',label:'Fogo do Fígado',element:'wood',nature:{excess:.92,heat:.96}},
  {id:'liver_blood',label:'Deficiência de Sangue do Fígado',element:'wood',nature:{deficiency:.82}},
  {id:'liver_yin',label:'Deficiência de Yin do Fígado',element:'wood',nature:{deficiency:.84,heat:.46}},
  {id:'liver_damp_heat',label:'Umidade-Calor no Fígado',element:'wood',nature:{excess:.78,heat:.78}},
  {id:'liver_spleen',label:'Fígado sobreagindo ao Baço',element:'wood',nature:{stagnation:.72,excess:.48}},
  {id:'liver_insulting_lung',label:'Fígado insultando o Pulmão',element:'wood',nature:{excess:.78,heat:.52}},
  {id:'liver_yang_wind',label:'Yang do Fígado gerando Vento',element:'wood',nature:{excess:.88,heat:.58}},

  // FIRE
  {id:'heart_qi',label:'Deficiência de Qi do Coração',element:'fire',nature:{deficiency:.76}},
  {id:'heart_blood',label:'Deficiência de Sangue do Coração',element:'fire',nature:{deficiency:.78}},
  {id:'heart_yin',label:'Deficiência de Yin do Coração',element:'fire',nature:{deficiency:.82,heat:.62}},
  {id:'heart_yang',label:'Deficiência de Yang do Coração',element:'fire',nature:{deficiency:.90,cold:.82}},
  {id:'heart_fire',label:'Fogo do Coração',element:'fire',nature:{excess:.94,heat:.98}},
  {id:'heart_phlegm_fire',label:'Fleuma-Fogo no Coração',element:'fire',nature:{excess:.90,heat:.92}},
  {id:'heart_blood_stasis',label:'Estase de Sangue do Coração',element:'fire',nature:{stagnation:.92,excess:.52}},
  {id:'heart_yin_liver_qi',label:'Deficiência de Yin do Coração com Estagnação do Qi do Fígado',element:'fire',nature:{deficiency:.68,stagnation:.72}},

  // METAL — Lung
  {id:'lung_qi',label:'Deficiência de Qi do Pulmão',element:'metal',nature:{deficiency:.82}},
  {id:'lung_yin',label:'Deficiência de Yin do Pulmão',element:'metal',nature:{deficiency:.84,heat:.42}},
  {id:'lung_heat',label:'Calor no Pulmão',element:'metal',nature:{excess:.80,heat:.90}},
  {id:'lung_dryness',label:'Secura do Pulmão',element:'metal',nature:{deficiency:.34}},
  {id:'lung_wind_cold',label:'Vento-Frio no Pulmão',element:'metal',nature:{excess:.62,cold:.84}},
  {id:'lung_wind_heat',label:'Vento-Calor no Pulmão',element:'metal',nature:{excess:.64,heat:.82}},
  {id:'lung_wind_damp',label:'Vento-Umidade no Pulmão',element:'metal',nature:{excess:.60}},
  {id:'lung_phlegm_cold',label:'Fleuma-Frio no Pulmão',element:'metal',nature:{excess:.76,cold:.82}},
  {id:'lung_phlegm_heat',label:'Fleuma-Calor no Pulmão',element:'metal',nature:{excess:.84,heat:.86}},
  {id:'lung_phlegm_fluid',label:'Fleuma-Fluidos no Pulmão',element:'metal',nature:{excess:.68,cold:.42}},

  // METAL — Large Intestine
  {id:'large_intestine_heat',label:'Calor no Intestino Grosso',element:'metal',nature:{excess:.82,heat:.90}},
  {id:'large_intestine_cold',label:'Frio no Intestino Grosso',element:'metal',nature:{excess:.72,cold:.92}},
  {id:'large_intestine_damp_heat',label:'Umidade-Calor no Intestino Grosso',element:'metal',nature:{excess:.78,heat:.82}},
  {id:'large_intestine_dryness',label:'Secura do Intestino Grosso',element:'metal',nature:{deficiency:.48}},

  // WATER
  {id:'kidney_qi',label:'Deficiência de Qi do Rim',element:'water',nature:{deficiency:.80}},
  {id:'kidney_yang',label:'Deficiência de Yang do Rim',element:'water',nature:{deficiency:.92,cold:.96}},
  {id:'kidney_yin',label:'Deficiência de Yin do Rim',element:'water',nature:{deficiency:.86,heat:.64}},
  {id:'kidney_essence',label:'Deficiência de Essência do Rim',element:'water',nature:{deficiency:.94}},
  {id:'kidney_yin_fire',label:'Deficiência de Yin do Rim com Fogo',element:'water',nature:{deficiency:.72,heat:.90}},
  {id:'kidney_qi_not_firm',label:'Qi do Rim não firme',element:'water',nature:{deficiency:.88}},
  {id:'kidney_receive_lung',label:'Rim falhando em receber o Qi do Pulmão',element:'water',nature:{deficiency:.82,cold:.46}},
  {id:'kidney_water_lung',label:'Água retornando ao Pulmão por deficiência do Rim',element:'water',nature:{deficiency:.86,cold:.62}},

  // Cross-system combinations explicitly represented by the book
  {id:'heart_kidney_disharmony',label:'Desarmonia Coração–Rim',element:'water',nature:{deficiency:.76,heat:.48}},
  {id:'spleen_kidney_yang',label:'Deficiência de Yang do Baço e Rim',element:'water',nature:{deficiency:.94,cold:.90}},
  {id:'liver_kidney_yin',label:'Deficiência de Yin do Fígado e Rim',element:'water',nature:{deficiency:.88,heat:.44}},
  {id:'kidney_yin_yang',label:'Deficiência de Yin e Yang do Rim',element:'water',nature:{deficiency:.96,cold:.46,heat:.32}},
  {id:'heart_spleen_qi',label:'Deficiência de Qi do Coração e Baço',element:'fire',nature:{deficiency:.88}},
  {id:'heart_spleen_blood_qi',label:'Deficiência de Sangue/Qi do Coração e Baço',element:'fire',nature:{deficiency:.92}},
]
