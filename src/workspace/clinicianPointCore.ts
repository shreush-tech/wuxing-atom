import type {PatternId} from '../clinical/types'

export type ClinicianPointCore={
  pattern:PatternId
  points:string[]
  scope:'verified_pattern_core'
}

export const clinicianPointCore:Partial<Record<PatternId,ClinicianPointCore>>={
  spleen_qi:{pattern:'spleen_qi',points:['ST36','SP3','SP6','BL20','LV13'],scope:'verified_pattern_core'},
  spleen_blood:{pattern:'spleen_blood',points:['SP6','ST36','LV8','SP4','BL17'],scope:'verified_pattern_core'},
  spleen_yin:{pattern:'spleen_yin',points:['SP6','ST36','REN12','KD7','SP3'],scope:'verified_pattern_core'},
  lung_qi:{pattern:'lung_qi',points:['ST36','LU7','REN6'],scope:'verified_pattern_core'},
  lung_yin:{pattern:'lung_yin',points:['LU7','LU9','REN17','LU5','SP6'],scope:'verified_pattern_core'},
  heart_blood:{pattern:'heart_blood',points:['ST36','SP6','LV8','HT7','BL17','BL15'],scope:'verified_pattern_core'},
  heart_yin:{pattern:'heart_yin',points:['HT6','KD6','KD7','SP6','HT7','BL15'],scope:'verified_pattern_core'},
  liver_stagnation:{pattern:'liver_stagnation',points:['LV3','GB34','PC6','LV14','REN17'],scope:'verified_pattern_core'},
  liver_yang_rising:{pattern:'liver_yang_rising',points:['LV2','LV3','GB34','LI4'],scope:'verified_pattern_core'},
  liver_fire:{pattern:'liver_fire',points:['LV3','LV2','GB34','GB43','KD1','ST44'],scope:'verified_pattern_core'}
}

export function recommendedClinicianPoints(patternIds:PatternId[]){
  // This function only composes already-verified pattern cores.
  // Readiness/confidence gating is applied by the caller before patternIds reach this layer.
  const seen=new Set<string>()
  const result:Array<{code:string;reasons:PatternId[]}>=[]

  for(const patternId of patternIds){
    const core=clinicianPointCore[patternId]
    if(!core)continue
    for(const code of core.points){
      const existing=result.find(x=>x.code===code)
      if(existing){
        if(!existing.reasons.includes(patternId))existing.reasons.push(patternId)
      }else{
        seen.add(code)
        result.push({code,reasons:[patternId]})
      }
    }
  }
  return result
}
