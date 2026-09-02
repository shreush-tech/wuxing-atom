export type MicroPathId='digestion'|'sleep'|'headache'|'low_back'

export interface MicroQuestion {
  id:string
  prompt:string
  options:string[]
  helper?:string
  priority:number
}

export interface MicroPath {
  id:MicroPathId
  title:string
  intro:string
  triggerIds:string[]
  questions:MicroQuestion[]
}

export const microPaths:Record<MicroPathId,MicroPath>={
  digestion:{
    id:'digestion',
    title:'Vamos entender como seu desconforto digestivo se comporta',
    intro:'O momento em que aparece e o que faz piorar ou melhorar ajudam a separar padrões que, à primeira vista, parecem iguais.',
    triggerIds:['bloating','reflux','constipation','diarrhea','nausea'],
    questions:[
      {id:'worse_after_meals',prompt:'Isso costuma piorar depois de comer?',options:['yes','no','unknown'],priority:10},
      {id:'worse_stress',prompt:'O estresse ou a irritação pioram claramente a digestão?',options:['yes','no','unknown'],priority:10},
      {id:'better_warmth',prompt:'Calor, bolsa quente ou comida morna costumam aliviar?',options:['yes','no','unknown'],priority:8},
      {id:'worse_raw_cold_food',prompt:'Alimentos frios ou crus costumam piorar?',options:['yes','no','unknown'],priority:8},
      {id:'poor_appetite',prompt:'Seu apetite costuma ficar reduzido?',options:['yes','no','unknown'],priority:7},
      {id:'dry_mouth',prompt:'Há boca ou lábios secos?',options:['yes','no','unknown'],priority:6},
      {id:'night_sweats',prompt:'Você sua à noite sem relação com calor do ambiente?',options:['yes','no','unknown'],priority:6},
      {id:'gas',prompt:'Gases fazem parte importante do quadro?',options:['yes','no','unknown'],priority:6},
      {id:'better_after_bm',prompt:'Quando evacua, o desconforto costuma aliviar?',options:['yes','no','unknown'],priority:7},
    ]
  },
  sleep:{
    id:'sleep',
    title:'Seu sono pode falhar de maneiras diferentes',
    intro:'Na referência, dificuldade para adormecer, despertares, sonhos, palpitações e sinais de calor aparecem em combinações distintas.',
    triggerIds:['poor_sleep','fatigue'],
    questions:[
      {id:'difficulty_falling_asleep',prompt:'O principal problema é pegar no sono?',options:['yes','no','unknown'],priority:10},
      {id:'frequent_waking',prompt:'Você acorda várias vezes durante a noite?',options:['yes','no','unknown'],priority:9},
      {id:'dream_disturbed',prompt:'Seu sono é muito cheio de sonhos ou agitado?',options:['yes','no','unknown'],priority:9},
      {id:'waking_1_3',prompt:'É comum acordar entre 1h e 3h?',options:['yes','no','unknown'],priority:8},
      {id:'palpitations',prompt:'Palpitações acompanham o problema do sono?',options:['yes','no','unknown'],priority:8},
      {id:'poor_memory',prompt:'Você percebe memória pior junto dessa fase?',options:['yes','no','unknown'],priority:6},
      {id:'night_sweats',prompt:'Há suor noturno?',options:['yes','no','unknown'],priority:7},
      {id:'dry_mouth',prompt:'Há boca seca à noite?',options:['yes','no','unknown'],priority:7},
      {id:'five_center_heat',prompt:'Você sente calor em mãos, pés ou região do peito?',options:['yes','no','unknown'],priority:7},
    ]
  },
  headache:{
    id:'headache',
    title:'Vamos localizar melhor a sua dor de cabeça',
    intro:'Localização, qualidade da dor e sinais associados ajudam a diferenciar os padrões descritos no livro.',
    triggerIds:['headache','temporal_headache'],
    questions:[
      {id:'temporal_headache',prompt:'A dor fica principalmente nas têmporas?',options:['yes','no','unknown'],priority:10},
      {id:'throbbing_headache',prompt:'Ela é latejante ou pulsátil?',options:['yes','no','unknown'],priority:8},
      {id:'dizziness',prompt:'Tontura aparece junto?',options:['yes','no','unknown'],priority:8},
      {id:'tinnitus',prompt:'Há zumbido?',options:['yes','no','unknown'],priority:7},
      {id:'red_face_eyes',prompt:'Seu rosto ou olhos ficam muito vermelhos quando a dor aparece?',options:['yes','no','unknown'],priority:8},
      {id:'bitter_taste',prompt:'Há gosto amargo na boca?',options:['yes','no','unknown'],priority:8},
      {id:'thirst',prompt:'A sede aumenta?',options:['yes','no','unknown'],priority:6},
      {id:'dry_eyes',prompt:'Os olhos ficam secos?',options:['yes','no','unknown'],priority:6},
      {id:'rib_pain',prompt:'Há também dor ou tensão na lateral das costelas?',options:['yes','no','unknown'],priority:5},
    ]
  },
  low_back:{
    id:'low_back',
    title:'A lombalgia precisa primeiro ser descrita pelo comportamento da dor',
    intro:'O livro separa quadros de frio/umidade, calor/umidade, estase e deficiência por características diferentes da dor e por sinais associados.',
    triggerIds:['low_back'],
    questions:[
      {id:'acute_low_back',prompt:'A dor começou de forma relativamente aguda?',options:['yes','no','unknown'],priority:8},
      {id:'low_back_cold_heavy',prompt:'A região parece fria, pesada ou dolorida?',options:['yes','no','unknown'],priority:10},
      {id:'worse_cold_rain',prompt:'Piora em dias frios, chuvosos ou úmidos?',options:['yes','no','unknown'],priority:9},
      {id:'better_rest',prompt:'Melhora claramente com repouso?',options:['yes','no','unknown'],priority:7},
      {id:'hot_swollen_back',prompt:'Há sensação de calor ou inchaço na lombar?',options:['yes','no','unknown'],priority:9},
      {id:'worse_hot_humid',prompt:'Piora em clima quente e úmido?',options:['yes','no','unknown'],priority:8},
      {id:'fixed_piercing_back',prompt:'A dor é fixa, aguda ou perfurante?',options:['yes','no','unknown'],priority:9},
      {id:'worse_pressure',prompt:'A dor piora quando você aperta a região?',options:['yes','no','unknown'],priority:7},
      {id:'worse_evening',prompt:'Piora no fim do dia ou à noite?',options:['yes','no','unknown'],priority:6},
      {id:'cold_limbs',prompt:'Mãos ou pés ficam frios com frequência?',options:['yes','no','unknown'],priority:6},
      {id:'night_sweats',prompt:'Há suor noturno?',options:['yes','no','unknown'],priority:6},
      {id:'dry_mouth',prompt:'Há boca seca?',options:['yes','no','unknown'],priority:5},
    ]
  }
}

export function detectMicroPath(selected:Record<string,string|undefined>):MicroPath|null{
  const paths=Object.values(microPaths)
  const scored=paths.map(path=>({
    path,
    score:path.triggerIds.reduce((sum,id)=>sum+(selected[id]==='yes'?1:0),0)
  })).sort((a,b)=>b.score-a.score)
  return scored[0]?.score>0?scored[0].path:null
}

export function nextMicroQuestions(selected:Record<string,string|undefined>,limit=3){
  const path=detectMicroPath(selected)
  if(!path)return {path:null,questions:[]}
  const questions=path.questions
    .filter(q=>selected[q.id]===undefined || selected[q.id]==='unknown')
    .sort((a,b)=>b.priority-a.priority)
    .slice(0,limit)
  return {path,questions}
}
