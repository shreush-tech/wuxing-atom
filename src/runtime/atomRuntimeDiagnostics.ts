export type RuntimeSnapshot={
  webgl:boolean
  webgl2:boolean
  dpr:number
  width:number
  height:number
  cores:number|null
  memoryGB:number|null
  reducedMotion:boolean
  touch:boolean
  standalone:boolean
  userAgent:string
}

export function getAtomRuntimeSnapshot():RuntimeSnapshot{
  if(typeof window==='undefined' || typeof document==='undefined'){
    return {
      webgl:true,webgl2:false,dpr:1,width:0,height:0,cores:null,memoryGB:null,
      reducedMotion:false,touch:false,standalone:false,userAgent:'server'
    }
  }
  let webgl=false,webgl2=false
  try{
    const c=document.createElement('canvas')
    webgl2=!!c.getContext('webgl2')
    webgl=webgl2 || !!c.getContext('webgl')
  }catch{}
  const nav=navigator as Navigator & {deviceMemory?:number,standalone?:boolean}
  return {
    webgl,webgl2,
    dpr:window.devicePixelRatio||1,
    width:window.innerWidth,
    height:window.innerHeight,
    cores:nav.hardwareConcurrency||null,
    memoryGB:nav.deviceMemory||null,
    reducedMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false,
    touch:('ontouchstart' in window)||navigator.maxTouchPoints>0,
    standalone:Boolean(nav.standalone)||window.matchMedia?.('(display-mode: standalone)').matches||false,
    userAgent:navigator.userAgent
  }
}

export function atomRuntimeVerdict(s:RuntimeSnapshot){
  if(!s.webgl)return {level:'fallback' as const,label:'versão simplificada',reason:'WebGL indisponível'}
  if(s.reducedMotion)return {level:'reduced' as const,label:'movimento reduzido',reason:'preferência de acessibilidade'}
  if((s.memoryGB!=null&&s.memoryGB<=2)||(s.cores!=null&&s.cores<=4))
    return {level:'light' as const,label:'3D leve',reason:'perfil de hardware'}
  return {level:'full' as const,label:'3D completo',reason:'ambiente compatível'}
}
