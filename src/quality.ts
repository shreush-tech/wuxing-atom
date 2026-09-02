export type QualityTier = 'high'|'medium'|'low'
export function detectQualityTier():QualityTier{
  if(typeof window==='undefined')return 'low'
  const mem=(navigator as any).deviceMemory || 4
  const cores=navigator.hardwareConcurrency || 4
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if(reduced || mem<=4 || cores<=6)return 'low'
  if(mem<=8 || cores<=10)return 'medium'
  return 'high'
}
export const qualityConfig={
  high:{dpr:[.9,.95] as [number,number],waterSegments:18,particles:0,shadows:false},
  medium:{dpr:[.8,.85] as [number,number],waterSegments:14,particles:0,shadows:false},
  low:{dpr:[.7,.75] as [number,number],waterSegments:10,particles:0,shadows:false}
}
