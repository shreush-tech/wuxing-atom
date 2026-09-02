import type { ReactNode } from 'react'
import {queryFlag} from '../utils/clientQuery'

export function ExperienceShell({children}:{children:ReactNode}){
  const embed=queryFlag('embed')
  return <div className={embed?'experience-shell embed-mode':'experience-shell'}>
    {children}
  </div>
}
