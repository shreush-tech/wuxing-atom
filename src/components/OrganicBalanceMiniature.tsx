import {useClinical} from '../clinical/store'
const items=[['wood','木','Madeira'],['fire','火','Fogo'],['earth','土','Terra'],['metal','金','Metal'],['water','水','Água']] as const
export function OrganicBalanceMiniature(){
 const {clinical}=useClinical()
 const max=Math.max(.001,...items.map(([id])=>clinical.elements[id].activity))
 return <div className="organic-mini" aria-label="Resumo visual dos Cinco Movimentos">
  <div className="organic-mini-core">陰<br/>陽</div>
  {items.map(([id,glyph,label],i)=>{const v=clinical.elements[id].activity/max;return <div key={id} className={`mini-gem ${id}`} style={{'--i':i,'--activity':Math.max(.28,v)} as any} title={`${label}: intensidade relativa ${Math.round(v*100)}%`}><b>{glyph}</b><span>{label}</span></div>})}
 </div>
}
