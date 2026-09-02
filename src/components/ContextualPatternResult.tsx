import {useClinical} from '../clinical/store'

export function ContextualPatternResult(){
 const {clinical}=useClinical()
 const rows=clinical.contextualDiagnoses||[]
 if(!clinical.interview.canShowResult||!rows.length)return null
 return <section className="contextual-patterns">
   <p className="result-kicker">Padrões adicionais relacionados à sua queixa</p>
   {rows.slice(0,5).map(r=><article key={r.id}>
     <strong>{r.label}</strong>
     <span>apareceu no contexto dos sintomas selecionados</span>
   </article>)}
 </section>
}
