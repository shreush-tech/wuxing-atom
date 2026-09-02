export function RelationLegend(){
  return <details className="relation-legend">
    <summary>Como ler as conexões do mapa</summary>
    <div className="legend-grid">
      <div><strong>Ciclo externo</strong><span>mostra a organização clássica dos Cinco Elementos</span></div>
      <div><strong>Conexões internas</strong><span>mostram como os elementos se relacionam dentro do modelo</span></div>
      <div><strong>Relação em evidência</strong><span>ganha presença apenas quando suas respostas sustentam essa interação</span></div>
    </div>
    <small>As linhas ajudam a visualizar o mapa. Elas não representam, sozinhas, um diagnóstico.</small>
  </details>
}
