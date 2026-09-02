import type { ElementId } from '../clinical/types'

export const elementMeta: Record<ElementId,{
  char:string;name:string;organs:string;keywords:string;color:string
}> = {
  wood:{char:'木',name:'Madeira',organs:'Fígado · Vesícula Biliar',keywords:'movimento · adaptação · direção',color:'#365b42'},
  fire:{char:'火',name:'Fogo',organs:'Coração · Intestino Delgado',keywords:'presença · circulação · expressão',color:'#b85f50'},
  earth:{char:'土',name:'Terra',organs:'Baço · Estômago',keywords:'centro · transformação · sustentação',color:'#b89055'},
  metal:{char:'金',name:'Metal',organs:'Pulmão · Intestino Grosso',keywords:'ritmo · troca · organização',color:'#b9b5aa'},
  water:{char:'水',name:'Água',organs:'Rim · Bexiga',keywords:'reserva · profundidade · conservação',color:'#245366'},
}
