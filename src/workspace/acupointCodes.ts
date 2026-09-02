const prefixAliases:Record<string,string>={
  F:'LV',LV:'LV',
  IG:'LI',LI:'LI',
  E:'ST',ST:'ST',
  BP:'SP',SP:'SP',
  R:'KD',KD:'KD',
  B:'BL',BL:'BL',
  C:'HT',HT:'HT',
  P:'LU',LU:'LU',
  PC:'PC',CS:'PC',
  VB:'GB',GB:'GB',
  ID:'SI',SI:'SI',
  TA:'SJ',SJ:'SJ',
  VC:'REN',REN:'REN',
  VG:'DU',DU:'DU'
}

const ptDisplay:Record<string,string>={
  LV:'F',LI:'IG',ST:'E',SP:'BP',KD:'R',BL:'B',HT:'C',LU:'P',
  PC:'PC',GB:'VB',SI:'ID',SJ:'TA',REN:'VC',DU:'VG'
}

export type ParsedPoint={
  canonical:string
  displayPtBr:string
  input:string
}

export function parseAcupointCode(input:string):ParsedPoint|null{
  const raw=input.trim().toUpperCase()
    .replace(/[–—−]/g,'-')
    .replace(/\s+/g,'')
    .replace(/\./g,'')
  if(!raw)return null

  const m=raw.match(/^([A-ZÇ]{1,3})-?(\d{1,3})$/)
  if(!m)return null
  const canonicalPrefix=prefixAliases[m[1]]
  if(!canonicalPrefix)return null
  const n=String(Number(m[2]))
  if(n==='0')return null
  return {
    canonical:`${canonicalPrefix}${n}`,
    displayPtBr:`${ptDisplay[canonicalPrefix]||canonicalPrefix}${n}`,
    input
  }
}

export function parseAcupointList(text:string){
  // Accept commas, semicolons, line breaks and spaces between complete codes.
  // Also supports "F3 IG4 E36 BP6" without breaking prefix/number pairs.
  const tokens=text
    .replace(/\n/g,',')
    .split(/[;,]+|\s+(?=[A-Za-zÇ]{1,3}\s*-?\s*\d)/)
    .map(x=>x.trim())
    .filter(Boolean)

  const result:ParsedPoint[]=[]
  const seen=new Set<string>()
  const invalid:string[]=[]

  for(const token of tokens){
    const p=parseAcupointCode(token)
    if(!p){invalid.push(token);continue}
    if(seen.has(p.canonical))continue
    seen.add(p.canonical)
    result.push(p)
  }
  return {points:result,invalid}
}

export function displayAcupointPtBr(canonical:string){
  return parseAcupointCode(canonical)?.displayPtBr||canonical
}
