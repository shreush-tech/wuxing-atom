import {patterns} from '../clinical/patterns'
const patternLabels=Object.fromEntries(patterns.map(p=>[p.id,p.label])) as Record<string,string>
export const patternLabel=(id:string|null)=>id?(patternLabels[id]||id):'—'
