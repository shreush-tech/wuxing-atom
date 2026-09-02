export type QualityTier = 'high'|'medium'|'low'

export function detectQualityTier():QualityTier{
  if(typeof window==='undefined')return 'medium'
  const mem=(navigator as any).deviceMemory || 4
  const cores=navigator.hardwareConcurrency || 4
  const dpr=window.devicePixelRatio || 1
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if(reduced)return 'low'
  if(mem<=2 || cores<=4)return 'low'
  if(mem<=4 || dpr>2)return 'medium'
  return 'high'
}

export const qualityConfig = {
  high:{dpr:[1,1.35] as [number,number],waterSegments:56,particles:10,shadows:false},
  medium:{dpr:[1,1.15] as [number,number],waterSegments:40,particles:8,shadows:false},
  low:{dpr:[1,1] as [number,number],waterSegments:28,particles:5,shadows:false}
}
