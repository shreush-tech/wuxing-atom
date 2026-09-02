const steps=['Sintomas','Diagnósticos clínicos','Seu mapa','Equilíbrio']
export function JourneyGuide({active=0}:{active?:number}){
 return <nav className="journey-guide" aria-label="Etapas da experiência">
  {steps.map((s,i)=><span key={s} className={i===active?'active':''}><b>{i+1}</b>{s}</span>)}
 </nav>
}
