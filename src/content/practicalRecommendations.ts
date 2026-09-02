import type { PatternId } from '../clinical/types'

export interface PracticalRecommendation {
  patternId:PatternId
  diet?:{
    title:string
    prefer:string[]
    reduce:string[]
    habits:string[]
    sourceNote:string
  }
  acupoints:string[]
  acupressurePoints:string[]
  principle:string
}

export const practicalRecommendations:Partial<Record<PatternId,PracticalRecommendation>>={
  spleen_qi:{
    patternId:'spleen_qi',
    principle:'Fortalecer a função digestiva segundo a leitura tradicional.',
    diet:{
      title:'Uma alimentação mais favorável à Terra',
      prefer:['arroz integral','aveia','espelta','cenoura','nabo','batata-doce','inhame','abóbora','ervilha','gengibre','canela'],
      reduce:['alimentos muito frios','grande quantidade de alimentos crus'],
      habits:['preferir preparações cozidas e mornas quando isso fizer sentido na sua rotina'],
      sourceNote:'Lista alimentar explicitamente apresentada no livro para Deficiência de Qi do Baço.'
    },
    acupoints:['ST36','SP3','SP6','BL20','LV13'],
    acupressurePoints:['ST36','SP6']
  },
  spleen_yang:{
    patternId:'spleen_yang',
    principle:'Aquecer e sustentar a função digestiva na linguagem tradicional.',
    diet:{
      title:'Calor e simplicidade para a digestão',
      prefer:['gengibre','noz-moscada','funcho','alho-poró','arroz','feijão-preto','melaço'],
      reduce:['alimentos crus','tomate','tofu','espinafre','excesso de sal','excesso de castanhas'],
      habits:['priorizar alimentos cozidos e evitar refeições predominantemente cruas'],
      sourceNote:'Lista alimentar explicitamente apresentada no livro para Deficiência de Yang do Baço.'
    },
    acupoints:['ST36','SP3','SP6','BL20','SP9','KD3','REN9','REN4'],
    acupressurePoints:['ST36','SP6']
  },
  liver_stagnation:{
    patternId:'liver_stagnation',
    principle:'Favorecer a circulação do Qi segundo a lógica tradicional.',
    acupoints:['LV3','GB34','PC6','LV14','REN17'],
    acupressurePoints:['LV3','PC6']
  },
  liver_spleen:{
    patternId:'liver_spleen',
    principle:'Regular a relação entre tensão emocional e função digestiva.',
    acupoints:['LV13','LV14','REN12','PC6','SP6','ST36','LI4','LV3'],
    acupressurePoints:['PC6','ST36','LV3']
  },
  food_stagnation:{
    patternId:'food_stagnation',
    principle:'Reduzir estagnação alimentar segundo a diferenciação tradicional.',
    acupoints:['REN12','ST36','ST25'],
    acupressurePoints:['ST36','PC6']
  },
  kidney_yin:{
    patternId:'kidney_yin',
    principle:'Nutrir Yin do Rim segundo a leitura tradicional.',
    acupoints:['KD3','KD6','LU7','SP6','KD10'],
    acupressurePoints:['KD3','SP6']
  },
  heart_blood:{
    patternId:'heart_blood',
    principle:'Nutrir Sangue e acalmar a mente segundo a linguagem tradicional.',
    acupoints:['ST36','SP6','LV8','HT7','BL17','BL15'],
    acupressurePoints:['HT7','ST36']
  },
  heart_yin:{
    patternId:'heart_yin',
    principle:'Nutrir Yin e acalmar a mente segundo a linguagem tradicional.',
    acupoints:['HT6','KD6','KD7','SP6','HT7','BL15'],
    acupressurePoints:['HT7','SP6']
  }
}
