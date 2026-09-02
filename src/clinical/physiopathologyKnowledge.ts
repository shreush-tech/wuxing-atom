import type {PatternId} from './types'
export type PhysiopathologicalRelation={id:string;from:PatternId;to:PatternId;mechanism:'root_support'|'yin_fails_to_restrain'|'heat_consumes';explanation:string}

/** Explanatory knowledge only. Nothing here may mutate diagnostic scores. */
export const physiopathologicalRelations:PhysiopathologicalRelation[]=[
 {id:'kidney_yin_liver_yin',from:'kidney_yin',to:'liver_yin',mechanism:'root_support',explanation:'O Yin do Rim é uma raiz tradicional do Yin do organismo; ambos só aparecem quando possuem evidência sintomática própria.'},
 {id:'kidney_yin_liver_yang',from:'kidney_yin',to:'liver_yang_rising',mechanism:'yin_fails_to_restrain',explanation:'Base Yin insuficiente pode coexistir com Yang do Fígado ascendente, sem criar automaticamente esse segundo padrão.'},
 {id:'liver_yin_liver_yang',from:'liver_yin',to:'liver_yang_rising',mechanism:'yin_fails_to_restrain',explanation:'Deficiência de Yin do Fígado pode coexistir com Ascensão do Yang; os dois permanecem independentes.'},
 {id:'kidney_yin_liver_fire',from:'kidney_yin',to:'liver_fire',mechanism:'yin_fails_to_restrain',explanation:'Deficiência de Yin do Rim pode coexistir com Fogo do Fígado quando há sinais próprios de Fogo.'},
 {id:'kidney_yin_heart_fire',from:'kidney_yin',to:'heart_fire',mechanism:'yin_fails_to_restrain',explanation:'Deficiência da base Yin/Água pode coexistir com Fogo do Coração quando os sintomas sustentam ambos.'},
 {id:'liver_fire_liver_blood',from:'liver_fire',to:'liver_blood',mechanism:'heat_consumes',explanation:'Na fisiopatologia tradicional, Calor/Fogo persistente pode consumir Yin, líquidos e Xue; Deficiência de Sangue ainda exige sinais próprios.'},
 {id:'heart_fire_heart_blood',from:'heart_fire',to:'heart_blood',mechanism:'heat_consumes',explanation:'Fogo e Deficiência de Sangue podem coexistir; a relação de consumo é explicativa, nunca uma regra automática de pontuação.'}
]
export function explainSupportedRelations(activeIds:PatternId[]){const active=new Set(activeIds);return physiopathologicalRelations.filter(r=>active.has(r.from)&&active.has(r.to))}
