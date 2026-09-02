import { buildPersonalNarrative } from '../content/personalNarrative'
import { practicalRecommendations } from '../content/practicalRecommendations'
import { acupointAtlas } from '../content/acupointAtlas'
import { AcupointDiagram } from './AcupointDiagram'
import { useClinical } from '../clinical/store'

export function PracticalAftercare(){
  const {clinical}=useClinical()
  if(!clinical.interview.canShowResult)return null
  const narrative=buildPersonalNarrative(clinical)
  if(!narrative)return null
  const rec=practicalRecommendations[narrative.topId]
  const pressurePoints=(rec?.acupressurePoints||[]).map(id=>acupointAtlas[id]).filter(Boolean)

  return <section className="aftercare">
    <div className="aftercare-kicker">Agora, a parte prática</div>
    <h2>Pequenas ações coerentes com o seu mapa</h2>
    <p className="aftercare-lead">A leitura só ganha valor quando consegue virar uma orientação compreensível e segura para a rotina.</p>

    {rec?.diet&&<div className="aftercare-card">
      <div className="card-number">01</div>
      <h3>Alimentação chinesa para experimentar</h3>
      <p>{rec.diet.title}. A ideia não é criar uma dieta rígida, mas testar pequenas mudanças coerentes com o padrão que apareceu.</p>
      <div className="food-columns">
        <div><strong>Priorizar</strong><p>{rec.diet.prefer.join(' · ')}</p></div>
        <div><strong>Reduzir</strong><p>{rec.diet.reduce.join(' · ')}</p></div>
      </div>
      <p className="source-note">{rec.diet.habits.join(' ')}</p>
    </div>}

    {pressurePoints.length>0&&<div className="aftercare-card">
      <div className="card-number">02</div>
      <h3>Pontos de acupuntura e acupressão</h3>
      <p>Estes acupontos aparecem no conjunto tradicional relacionado ao padrão. Alguns podem ser explorados de forma não invasiva por acupressão ou Tuiná — massagem chinesa em acupontos. O conteúdo não ensina autoagulhamento.</p>
      <div className="massage-grid">{pressurePoints.map(p=><article key={p.id}>
        <AcupointDiagram point={p}/>
        <div className="point-copy">
          <strong>{p.id} · {p.name} <span className="hanzi">{p.chinese}</span></strong>
          <p>{p.layLocation}</p>
          <small>Para acupressão/Tuiná: estímulo manual confortável, sem buscar dor forte. {p.note}</small>
        </div>
      </article>)}</div>
    </div>}

    {rec&&<div className="aftercare-card acupuncture">
      <div className="card-number">03</div>
      <h3>Como a acupuntura pode abordar esse mapa</h3>
      <p>{rec.principle} A referência relaciona esse padrão aos pontos abaixo; numa consulta, a combinação final é revista de acordo com a história completa e a queixa principal.</p>
      <div className="acu-points">{rec.acupoints.map(p=><span key={p}>{p}</span>)}</div>
      <p className="source-note">Conteúdo educativo sobre acupontos tradicionalmente relacionados ao padrão. A seleção e a técnica de acupuntura pertencem à avaliação profissional; não são fornecidas instruções de autoagulhamento.</p>
    </div>}

    <div className="consult-card">
      <div>
        <div className="aftercare-kicker">Próximo passo</div>
        <h3>Leve seu mapa para uma consulta</h3>
        <p>Na consulta, este mapa vira ponto de partida — não diagnóstico final. As hipóteses podem ser confirmadas, modificadas ou descartadas após avaliação médica.</p>
      </div>
      <button type="button" onClick={()=>document.dispatchEvent(new CustomEvent('wuxing-book-consultation'))}>Quero aprofundar meu mapa</button>
    </div>
  </section>
}
