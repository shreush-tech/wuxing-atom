export type ElementEducation = {
  name:string
  organs:string
  headline:string
  body:string
  themes:string[]
  spirit:{name:string;label:string;balanced:string;imbalance:string}
  advanced:string[]
}

export const yinYangEducation={
  title:'Yin & Yang',
  headline:'O equilíbrio é movimento, não imobilidade.',
  short:'Yin e Yang são relativos, interdependentes e contêm a semente um do outro.',
  principles:[
    'Yin e Yang não são categorias absolutas: a mesma característica pode ser mais Yin ou mais Yang dependendo da comparação.',
    'Yin reúne aspectos mais internos, nutritivos, substanciais, refrigerantes e de repouso.',
    'Yang reúne aspectos mais externos, funcionais, aquecedores, ativos e transformadores.',
    'Um contém a semente do outro. A transformação contínua entre ambos é parte da própria ideia de equilíbrio.',
    'Nos Oito Princípios, Yin e Yang sintetizam outras diferenciações como Interior/Exterior, Frio/Calor e Deficiência/Excesso.'
  ],
  clinicalTeaching:[
    'Calor por excesso não é o mesmo que calor por deficiência.',
    'A analogia do sistema de resfriamento ajuda a compreender a Deficiência de Yin: pode haver aquecimento relativo porque a capacidade de resfriar e nutrir ficou insuficiente.'
  ]
} as const

export const elementEducation:Record<'wood'|'fire'|'earth'|'metal'|'water',ElementEducation>={
  wood:{
    name:'Madeira',organs:'Fígado · Vesícula Biliar',
    headline:'Fluxo, direção e capacidade de adaptação.',
    body:'Na teoria da Medicina Chinesa, a Madeira está ligada ao movimento do Qi, ao planejamento e à capacidade de responder às mudanças. O Fígado é descrito como responsável por favorecer o fluxo suave do Qi, armazenar o Sangue e relacionar-se com tendões e olhos.',
    themes:['movimento do Qi','planejamento','Sangue','tendões','olhos','estresse'],
    spirit:{name:'Hun',label:'O planejador',balanced:'visão, criatividade e metas claras',imbalance:'irritabilidade, frustração e sensação de estar preso'},
    advanced:[
      'As aulas diferenciam Estagnação do Qi do Fígado, Ascensão do Yang, Fogo do Fígado, Deficiência de Sangue e Vento Interno.',
      'Suspiros frequentes, sensação de bolo na garganta e piora clara com estresse são perguntas úteis no interrogatório de Estagnação do Qi.',
      'Ascensão do Yang e Fogo não devem ser tratados como sinônimos: a aula usa a ideia de um fenômeno episódico versus um calor/excesso mais persistente.'
    ]
  },
  fire:{
    name:'Fogo',organs:'Coração · Intestino Delgado',
    headline:'Presença, circulação, calor e consciência.',
    body:'O Fogo organiza a dimensão mais expansiva e expressiva do mapa. O Coração é apresentado como governante da circulação do Sangue e morada do Shen, ligando a esfera física à qualidade de presença, sono e atividade mental.',
    themes:['Shen','circulação','sono','suor','expressão','calor'],
    spirit:{name:'Shen',label:'A consciência',balanced:'alegria, serenidade e presença',imbalance:'agitação, ansiedade e insônia'},
    advanced:[
      'O interrogatório do sono diferencia dificuldade para adormecer, despertares, sonhos/pesadelos e inquietação com calor.',
      'Suor noturno e suor espontâneo diurno apontam para mecanismos diferentes dentro da lógica tradicional.',
      'Fogo do Coração é apresentado como padrão de excesso e deve ser diferenciado de quadros de deficiência de Yin.'
    ]
  },
  earth:{
    name:'Terra',organs:'Baço · Estômago',
    headline:'Transformação, nutrição e centro.',
    body:'A Terra representa o centro transformador: receber alimento, extrair recursos e sustentar o organismo. O Baço é ensinado como importante na formação do Qi e do Sangue e na manutenção das estruturas; o Estômago recebe e inicia a transformação.',
    themes:['digestão','transformação','Qi pós-natal','Sangue','umidade','sustentação'],
    spirit:{name:'Yi',label:'O intelecto',balanced:'foco, lógica e capacidade de resolver problemas',imbalance:'ruminação, preocupação e névoa mental'},
    advanced:[
      'Distensão depois de comer, fezes amolecidas, fadiga e preocupação formam um conjunto relevante no interrogatório de Deficiência de Qi do Baço.',
      'As aulas enfatizam a relação entre Baço enfraquecido e acúmulo de Umidade/Fleuma.',
      'Alterações mais intensas podem ser ensinadas em associação com a função de manter Sangue e órgãos em seus lugares.'
    ]
  },
  metal:{
    name:'Metal',organs:'Pulmão · Intestino Grosso',
    headline:'Respiração, troca, defesa e capacidade de deixar ir.',
    body:'O Metal está associado ao Pulmão e ao Intestino Grosso. As aulas relacionam o Pulmão ao Qi, à pele e à função defensiva, enquanto o Intestino Grosso participa da eliminação. É um elemento de troca entre interior e exterior.',
    themes:['respiração','Qi','pele','defesa','eliminação','ritmo'],
    spirit:{name:'Po',label:'O instintivo',balanced:'presença corporal e instinto de preservação',imbalance:'insegurança, medo e dificuldade de desapego'},
    advanced:[
      'Vento-Frio e Vento-Calor são diferenciados por aversão ao frio, sede e características das secreções.',
      'Fleuma-Calor no Pulmão apresenta um conjunto diferente de uma deficiência de Qi ou Yin.',
      'Dificuldade especialmente inspiratória é usada nas aulas para explorar a relação funcional entre Pulmão e Rim.'
    ]
  },
  water:{
    name:'Água',organs:'Rim · Bexiga',
    headline:'Reserva, profundidade, Essência e capacidade de sustentar.',
    body:'A Água representa reserva e continuidade. Os Rins são apresentados como guardiões da Essência (Jing), ligados ao desenvolvimento, envelhecimento, ossos, medula, audição e funções de armazenamento e sustentação do Aquecedor Inferior.',
    themes:['Jing','desenvolvimento','envelhecimento','ossos','audição','Ming Men'],
    spirit:{name:'Zhi',label:'A vontade',balanced:'resiliência e determinação',imbalance:'indecisão e medo paralisante'},
    advanced:[
      'Deficiência de Yang do Rim é ensinada com frio marcante, fraqueza e alterações de líquidos.',
      'Deficiência de Yin do Rim é diferenciada por sinais de calor por deficiência, como calor nos cinco centros e suor noturno.',
      'Deficiência de Qi do Rim enfatiza a incapacidade de conter adequadamente funções urinárias.'
    ]
  }
}
