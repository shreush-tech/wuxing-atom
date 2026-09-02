export type RelationshipKind='generation'|'control'|'overacting'|'countercontrol'

export const relationshipFocusCopy={
  generation:{
    glyph:'·',
    name:'Conexão entre elementos',
    phrase:'Dois elementos aparecem relacionados dentro do seu mapa.'
  },
  control:{
    glyph:'·',
    name:'Conexão entre elementos',
    phrase:'Dois elementos aparecem relacionados dentro do seu mapa.'
  },
  overacting:{
    glyph:'·',
    name:'Conexão no mapa',
    phrase:'A combinação das suas respostas destacou uma interação entre estes elementos.'
  },
  countercontrol:{
    glyph:'·',
    name:'Conexão no mapa',
    phrase:'A combinação das suas respostas destacou uma interação entre estes elementos.'
  }
} as const
