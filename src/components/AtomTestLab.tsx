import {useMemo,useState} from 'react'
import {useClinical} from '../clinical/store'
import {regressionScenarios} from '../clinical/regressionScenarios'

export function AtomTestLab(){
  const enabled=useMemo(()=>typeof window!=='undefined' && new URLSearchParams(window.location.search).get('atomTest')==='1',[])
  const {setAnswer,clear}=useClinical()
  const [active,setActive]=useState<string>('')

  if(!enabled)return null

  function load(id:string){
    const scenario=regressionScenarios.find(x=>x.id===id)
    if(!scenario)return
    clear()
    for(const [symptom,value] of Object.entries(scenario.selected))setAnswer(symptom,value)
    setActive(id)
  }

  return <div className="atom-test-lab" aria-label="Atom test lab">
    <div className="atom-test-head">
      <strong>ATOM LAB</strong>
      <button onClick={()=>{clear();setActive('')}}>limpar</button>
    </div>
    <p>Carregue um cenário clínico e observe se o átomo responde sem quebrar a composição.</p>
    <div className="atom-test-grid">
      {regressionScenarios.map(s=><button
        key={s.id}
        className={active===s.id?'active':''}
        onClick={()=>load(s.id)}
        title={s.expectation}
      >{s.description}</button>)}
    </div>
  </div>
}
