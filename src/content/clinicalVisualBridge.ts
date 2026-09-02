import type { ClinicalState } from '../clinical/types'

export type ElementKey='wood'|'fire'|'earth'|'metal'|'water'
export type VisualElementState={
  presence:number
  breath:number
  orbit:number
  luminosity:number
  tension:number
}
export type ClinicalVisualMap={
  elements:Record<ElementKey,VisualElementState>
  relationStrength:number
  resultReady:boolean
}

const BASE:VisualElementState={presence:.82,breath:1,orbit:1,luminosity:.58,tension:0}

export function clinicalVisualBridge(c:ClinicalState):ClinicalVisualMap{
  const keys:ElementKey[]=['wood','fire','earth','metal','water']
  const elements=Object.fromEntries(keys.map(k=>{
    const raw=(c.elements as any)?.[k]||{}
    const activity=Math.max(0,Math.min(1,Number(raw.activity||0)))
    const emphasis=Math.max(0,Math.min(1,Number(raw.emphasis||activity)))
    return [k,{
      presence:.80+emphasis*.16,
      breath:.92+activity*.16,
      orbit:1-activity*.10,
      luminosity:.52+emphasis*.30,
      tension:Math.max(0,Math.min(1,Number(raw.tension||0)))
    }]
  })) as Record<ElementKey,VisualElementState>

  const relation=Array.isArray((c as any).relationships)
    ? (c as any).relationships[0]
    : (c as any).relationship
  const relationStrength=Math.max(0,Math.min(1,Number(relation?.strength||relation?.confidence||0)))

  return {
    elements,
    relationStrength,
    resultReady:Boolean(c.interview?.canShowResult)
  }
}
