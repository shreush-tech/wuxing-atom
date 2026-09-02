import type { ElementId } from './types'

export interface ClassicalEdge {
  id:string
  source:ElementId
  target:ElementId
  cycle:'sheng'|'ke'
}

/*
Classical Five-Phase topology used by the renderer.
Important: these edges are NOT diagnoses and are NOT automatically activated by scores.
Clinical activation remains restricted to explicit pattern/relationship rules in engine.ts.
*/
export const shengCycle: ClassicalEdge[] = [
  {id:'water_wood',source:'water',target:'wood',cycle:'sheng'},
  {id:'wood_fire',source:'wood',target:'fire',cycle:'sheng'},
  {id:'fire_earth',source:'fire',target:'earth',cycle:'sheng'},
  {id:'earth_metal',source:'earth',target:'metal',cycle:'sheng'},
  {id:'metal_water',source:'metal',target:'water',cycle:'sheng'},
]

export const keCycle: ClassicalEdge[] = [
  {id:'wood_earth',source:'wood',target:'earth',cycle:'ke'},
  {id:'earth_water',source:'earth',target:'water',cycle:'ke'},
  {id:'water_fire',source:'water',target:'fire',cycle:'ke'},
  {id:'fire_metal',source:'fire',target:'metal',cycle:'ke'},
  {id:'metal_wood',source:'metal',target:'wood',cycle:'ke'},
]
