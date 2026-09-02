import { branchDecision } from '../clinical/branchingInterview'
import { microPaths } from '../clinical/microInterviews'
import { useClinical } from '../clinical/store'

export function MicroInterview(){
  const {selected,setAnswer}=useClinical()
  const decision=branchDecision(selected)
  if(!decision.pathId || !decision.questions.length)return null
  const path=microPaths[decision.pathId as keyof typeof microPaths]

  return <div className="micro-interview">
    <div className="micro-kicker">Perguntas sobre esta queixa</div>
    <h3>{path.title}</h3>
    <p>{decision.phase==='entry' ? path.intro : decision.reason}</p>
    <div className="micro-list">
      {decision.questions.map(q=><div className="micro-q" key={q.id}>
        <span>{q.prompt}</span>
        <div>
          <button onClick={()=>setAnswer(q.id,'yes')}>Sim</button>
          <button onClick={()=>setAnswer(q.id,'no')}>Não</button>
          <button onClick={()=>setAnswer(q.id,'unknown')}>Não sei</button>
        </div>
      </div>)}
    </div>
    <div className="micro-foot">No máximo duas perguntas por etapa. Se as respostas não abrirem um ramo claro, o sistema volta ao fluxo adaptativo geral.</div>
  </div>
}
