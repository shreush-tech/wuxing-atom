import { useClinical } from '../clinical/store'
import { PatternDetails } from './PatternDetails'

export function EducationSection(){
  const {clinical}=useClinical()
  const top=clinical.patterns[0]

  return <section className="education-section" id="entenda-seu-mapa">
    <div className="education-eyebrow">Depois da leitura</div>
    <h2>Entenda o que apareceu</h2>
    <p className="education-lead">
      A experiência organiza combinações de sintomas segundo a lógica tradicional da Medicina Chinesa.
      O objetivo é tornar o raciocínio compreensível e educativo; a leitura não substitui diagnóstico médico.
    </p>

    {clinical.interview.canShowResult && top && top.raw>0 ? <div className="education-card">
      <div>
        <div className="education-label">Desequilíbrio em destaque</div>
        <h3>{top.label==='Desarmonia Coração–Rim'?'Desequilíbrio Coração–Rim':top.label}</h3>
        <p>Este foi um dos padrões que reuniu sinais mais consistentes entre as respostas selecionadas.</p>
      </div>
      <PatternDetails patternId={top.id}/>
    </div> : <div className="education-empty">
      Faça algumas escolhas na constelação para que esta seção passe a explicar os sinais que apareceram.
    </div>}
  </section>
}
