export type AdaptiveTier='full'|'balanced'|'light'

export function tierFromFps(fps:number,current:AdaptiveTier):AdaptiveTier{
  if(fps<34)return 'light'
  if(fps<46 && current==='full')return 'balanced'
  return current
}

export const adaptiveQuality={
  full:{particleFactor:1, dprFactor:1},
  balanced:{particleFactor:.72, dprFactor:.88},
  light:{particleFactor:.48, dprFactor:.72}
} as const
