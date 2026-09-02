import {elementEducation} from './theoryEducation'

export const elementFocusCopy={
  wood:{glyph:'木',name:'Madeira',organs:'Fígado · Vesícula Biliar',phrase:'Movimento, direção e capacidade de adaptação.',education:elementEducation.wood},
  fire:{glyph:'火',name:'Fogo',organs:'Coração · Intestino Delgado',phrase:'Presença, circulação, calor e consciência.',education:elementEducation.fire},
  earth:{glyph:'土',name:'Terra',organs:'Baço · Estômago',phrase:'Transformação, nutrição e centro.',education:elementEducation.earth},
  metal:{glyph:'金',name:'Metal',organs:'Pulmão · Intestino Grosso',phrase:'Respiração, troca, defesa e organização.',education:elementEducation.metal},
  water:{glyph:'水',name:'Água',organs:'Rim · Bexiga',phrase:'Reserva, Essência, profundidade e sustentação.',education:elementEducation.water}
} as const
export type FocusElement=keyof typeof elementFocusCopy
