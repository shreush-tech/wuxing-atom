import { Text } from '@react-three/drei'
import { useClinical } from '../clinical/store'

const glyph={wood:'木',fire:'火',earth:'土',metal:'金',water:'水'}
const pt={wood:'Madeira',fire:'Fogo',earth:'Terra',metal:'Metal',water:'Água'}
type Key=keyof typeof glyph

export function ElementGlyph({element,position=[0,1.15,0]}:{element:Key,position?:[number,number,number]}){
  const {clinical}=useClinical()
  const selected=String((clinical as any).selectedElement||'')
  if(selected!==element)return null
  return <group position={position}>
    <Text fontSize={.28} anchorX="center" anchorY="middle">{glyph[element]}</Text>
    <Text position={[0,-.28,0]} fontSize={.085} anchorX="center" anchorY="middle">{pt[element]}</Text>
  </group>
}
