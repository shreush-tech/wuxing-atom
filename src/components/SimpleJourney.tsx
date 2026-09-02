import { useClinical } from '../clinical/store'
import { simpleJourneyCopy } from '../content/simpleJourney'

export function SimpleJourney(){
  const {clinical}=useClinical()
  const copy=simpleJourneyCopy(clinical)
  return <div className="simple-journey">
    <strong>{copy.title}</strong>
    <span>{copy.detail}</span>
  </div>
}
