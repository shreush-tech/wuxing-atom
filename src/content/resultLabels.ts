export const patternLabels:Record<string,{short:string;traditional:string}>={
  spleen_qi:{short:'Digestão e energia',traditional:'Deficiência de Qi do Baço'},
  spleen_yang:{short:'Digestão, energia e frio',traditional:'Deficiência de Yang do Baço'},
  spleen_qi_sinking:{short:'Sustentação e energia digestiva',traditional:'Afundamento do Qi do Baço'},
  spleen_not_holding_blood:{short:'Energia digestiva e contenção',traditional:'Baço não contendo o Sangue'},
  stomach_yin:{short:'Digestão e secura',traditional:'Deficiência de Yin do Estômago'},
  liver_spleen:{short:'Tensão e digestão',traditional:'Desequilíbrio entre Fígado e Baço'},
  liver_stagnation:{short:'Tensão e circulação do Qi',traditional:'Estagnação do Qi do Fígado'},
  liver_yang_rising:{short:'Tensão, cabeça e ascensão',traditional:'Ascensão do Yang do Fígado'},
  liver_fire:{short:'Tensão e sinais de calor',traditional:'Fogo do Fígado'},
  large_intestine_heat:{short:'Intestino, calor e secura',traditional:'Calor no Intestino Grosso'},
  food_stagnation:{short:'Digestão e estagnação alimentar',traditional:'Estagnação de Alimentos'},
  kidney_yang:{short:'Reserva, lombar e frio',traditional:'Deficiência de Yang do Rim'},
  kidney_yin:{short:'Reserva, lombar e calor noturno',traditional:'Deficiência de Yin do Rim'},
  lung_qi:{short:'Respiração e energia',traditional:'Deficiência de Qi do Pulmão'},
  kidney_receive_lung:{short:'Respiração e reserva',traditional:'Rim não recebendo o Qi do Pulmão'},
  heart_qi:{short:'Coração e energia',traditional:'Deficiência de Qi do Coração'},
  heart_blood:{short:'Sono, memória e Coração',traditional:'Deficiência de Sangue do Coração'},
  heart_yin:{short:'Sono e calor noturno',traditional:'Deficiência de Yin do Coração'},
  heart_yang:{short:'Coração, energia e frio',traditional:'Deficiência de Yang do Coração'},
}

export const relationshipLabels:Record<string,{headline:string;plain:string}>={
  wood_earth:{
    headline:'Madeira → Terra',
    plain:'Suas respostas sugerem que tensão e estado emocional acompanham mudanças digestivas.'
  },
  metal_water:{
    headline:'Metal ↔ Água',
    plain:'A leitura aproximou manifestações respiratórias de sinais tradicionalmente associados à reserva do Rim.'
  }
}
