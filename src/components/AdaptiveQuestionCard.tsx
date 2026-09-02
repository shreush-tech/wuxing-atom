import { symptoms } from '../clinical/symptoms'
import { useClinical } from '../clinical/store'
import { computeSafety } from '../clinical/safetyGate'
import { branchDecision } from '../clinical/branchingInterview'

export function AdaptiveQuestionCard(){
  const {clinical,selected,setAnswer}=useClinical()
  if(!computeSafety(selected).canContinue)return null
  if(branchDecision(selected).questions.length)return null
  const ids=clinical.interview.nextBestQuestions.filter(id=>selected[id]===undefined || selected[id]==='unknown').slice(0,3)
  if(!ids.length)return null

  return <div id="adaptive-refine" className="question-card adaptive">
    <div className="section-title">Pergunta para diferenciar melhor</div>
    <div className="question-title">
      Alguma destas coisas também acontece com você?
    </div>
    <div className="question-helper">
      Escolhi estas opções porque elas ajudam a separar as hipóteses que estão mais próximas neste momento.
    </div>
    <div className="adaptive-list">
      {ids.map(id=>{
        const s=symptoms.find(x=>x.id===id)
        if(!s)return null
        return <div className="adaptive-row" key={id}>
          <span>{s.label}</span>
          <div>
            <button onClick={()=>setAnswer(id,'yes')}>Sim</button>
            <button onClick={()=>setAnswer(id,'no')}>Não</button>
            <button onClick={()=>setAnswer(id,'unknown')}>Não sei</button>
          </div>
        </div>
      })}
    </div>
  </div>
}
