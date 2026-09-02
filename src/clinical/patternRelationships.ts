import type {AnswerState,PatternId,PatternScore,SymptomId} from './types'

export type PatternRelationshipKind='coexisting'|'root_branch'|'differential'

export type PatternRelationship={
  id:string
  a:PatternId
  b:PatternId
  kind:PatternRelationshipKind
  title:string
  explanation:string
  discriminators:SymptomId[]
  scoreGap:number
  bothSupported:boolean
}

type PairDef={
  id:string
  a:PatternId
  b:PatternId
  kind:PatternRelationshipKind
  title:string
  explanation:string
  discriminators:SymptomId[]
}

/**
 * v0.90 principle:
 * Patterns are inferred from their own symptom roots. A second supported pattern
 * is never subtracted merely because its thermal/deficiency language appears
 * opposite to another one.
 *
 * Relationships help interpretation and question ordering; they are not mutual-
 * exclusion rules.
 */
const pairs:PairDef[]=[
  {
    id:'kidney_yin_and_yang',
    a:'kidney_yin',b:'kidney_yang',kind:'coexisting',
    title:'Deficiência de Yin e Yang do Rim',
    explanation:'Os dois padrões podem coexistir, especialmente em quadros crônicos ou debilitados. O motor mantém separadamente os sinais de perda de substância/nutrição e os sinais de perda de função/aquecimento/transformação.',
    discriminators:['five_center_heat','night_sweats','small_sips','low_back','tinnitus','cold','cold_feet','early_morning_diarrhea','clear_urine','urinary_dribbling']
  },
  {
    id:'liver_yin_with_yang_rising',
    a:'liver_yin',b:'liver_yang_rising',kind:'root_branch',
    title:'Deficiência de Yin do Fígado com Ascensão do Yang',
    explanation:'Uma raiz de deficiência de Yin pode coexistir com a manifestação de Ascensão do Yang. O motor deve reconhecer ambos quando os respectivos grupos de sintomas estiverem presentes.',
    discriminators:['blurred_vision','dry_eyes','night_sweats','dizziness','headache','red_eyes','irritable']
  },
  {
    id:'liver_blood_with_yang_rising',
    a:'liver_blood',b:'liver_yang_rising',kind:'root_branch',
    title:'Deficiência de Sangue do Fígado com Ascensão do Yang',
    explanation:'Deficiência de Sangue do Fígado e Ascensão do Yang podem aparecer no mesmo paciente quando os sintomas sustentam simultaneamente a raiz de deficiência e a manifestação ascendente.',
    discriminators:['blurred_vision','dry_eyes','poor_memory','dizziness','headache','irritable']
  },
  {
    id:'liver_kidney_yin_with_yang_rising',
    a:'kidney_yin',b:'liver_yang_rising',kind:'root_branch',
    title:'Deficiência de Yin de Fígado/Rim com Ascensão do Yang do Fígado',
    explanation:'A insuficiência da base Yin pode coexistir com sinais de Yang ascendente. O sistema não deve tratar esses achados como concorrentes excludentes.',
    discriminators:['low_back','tinnitus','night_sweats','five_center_heat','dizziness','headache']
  },

  // These remain useful differentials, but still do not exclude one another in code.
  {
    id:'stomach_heat_cold_differential',
    a:'stomach_fire',b:'cold_invades_stomach',kind:'differential',
    title:'Natureza térmica dos sintomas do Estômago',
    explanation:'Calor e Frio orientam mecanismos diferentes. Se ambos aparecem, o sistema mantém os dois grupos de sinais e prioriza perguntas de contexto em vez de apagar um padrão.',
    discriminators:['large_cold_gulps','constant_hunger','bad_breath','cold','better_warmth','worse_cold']
  },
  {
    id:'lung_wind_heat_cold_differential',
    a:'lung_wind_heat',b:'lung_wind_cold',kind:'differential',
    title:'Vento-Calor e Vento-Frio no Pulmão',
    explanation:'Os dois conjuntos são diferenciados por sede, aversão ao frio, garganta e secreções. A presença de sinais mistos não autoriza exclusão automática.',
    discriminators:['thirst','yellow_phlegm','clear_runny_nose','sore_throat','strong_aversion_cold']
  },
  {
    id:'lung_phlegm_heat_cold_differential',
    a:'lung_phlegm_heat',b:'lung_phlegm_cold',kind:'differential',
    title:'Fleuma-Calor e Fleuma-Frio no Pulmão',
    explanation:'A natureza da Fleuma é refinada por secreções, sede e sensação térmica. O sistema usa isso para caracterizar, não para impor exclusividade.',
    discriminators:['yellow_phlegm','thick_phlegm','thirst','cold','clear_phlegm']
  },
  {
    id:'large_intestine_heat_cold_differential',
    a:'large_intestine_heat',b:'large_intestine_cold',kind:'differential',
    title:'Calor e Frio no Intestino Grosso',
    explanation:'Sinais térmicos diferentes podem refletir componentes diferentes do quadro ou momentos distintos. O algoritmo preserva a evidência de cada padrão.',
    discriminators:['burning_stool','foul_stool','watery_stool','better_warmth','worse_cold']
  },
  {
    id:'heart_fire_yang_def_differential',
    a:'heart_fire',b:'heart_yang',kind:'differential',
    title:'Fogo do Coração e Deficiência de Yang do Coração',
    explanation:'São mecanismos diferentes. Se houver suporte sintomático para ambos, o aplicativo pede contexto adicional e mantém cada escore independente.',
    discriminators:['near_total_insomnia','marked_agitation','large_cold_gulps','cold','cold_limbs','palpitations']
  }
]

export function computePatternRelationships(
  scores:PatternScore[],
  selected:Record<string,AnswerState>
):PatternRelationship[]{
  const byId=new Map(scores.map(s=>[s.id,s]))
  return pairs.flatMap(def=>{
    const a=byId.get(def.a),b=byId.get(def.b)
    if(!a||!b)return []
    const bothSupported=a.raw>=2.5&&b.raw>=2.5
    if(!bothSupported)return []
    const pending=def.discriminators.filter(id=>!selected[id]||selected[id]==='unknown')
    return [{
      ...def,
      discriminators:pending,
      scoreGap:Math.abs(a.raw-b.raw),
      bothSupported
    }]
  }).sort((x,y)=>{
    const rank=(k:PatternRelationshipKind)=>k==='root_branch'?0:k==='coexisting'?1:2
    return rank(x.kind)-rank(y.kind)||x.scoreGap-y.scoreGap
  })
}

export function relationshipQuestionPriority(relationships:PatternRelationship[]){
  const seen=new Set<string>()
  const out:string[]=[]
  for(const rel of relationships){
    // Questions refine the picture. They never exist to "eliminate" the other pattern.
    for(const id of rel.discriminators){
      if(seen.has(id))continue
      seen.add(id);out.push(id)
    }
  }
  return out
}
