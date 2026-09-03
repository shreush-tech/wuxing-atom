import {useClinical} from '../clinical/store'
const orbitItems=[['wood','木','Madeira'],['earth','土','Terra'],['metal','金','Metal'],['water','水','Água']] as const
export function OrganicBalanceMiniature(){
 const {clinical}=useClinical()
 const ids=['wood','fire','earth','metal','water'] as const
 const max=Math.max(.001,...ids.map(id=>clinical.elements[id].activity))
 const fire=Math.max(.28,clinical.elements.fire.activity/max)
 return <div className="organic-mini" aria-label="Resumo visual dos Cinco Movimentos">
  <div className="organic-mini-core fire" style={{'--activity':fire} as any}><b>火</b><span>Fogo</span></div>
  <div className="organic-mini-yinyang">陰陽</div>
  {orbitItems.map(([id,glyph,label],i)=>{const v=clinical.elements[id].activity/max;return <div key={id} className={`mini-gem ${id}`} style={{'--i':i,'--activity':Math.max(.28,v)} as any} title={`${label}: intensidade relativa ${Math.round(v*100)}%`}><b>{glyph}</b><span>{label}</span></div>})}
 </div>
}
