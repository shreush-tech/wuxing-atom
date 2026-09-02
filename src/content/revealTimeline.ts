export type RevealPhase='idle'|'gather'|'focus'|'settled'

export function revealPhase(ms:number):RevealPhase{
  if(ms<0)return 'idle'
  if(ms<650)return 'gather'
  if(ms<1700)return 'focus'
  return 'settled'
}

export const revealCopy={
  gather:'Organizando seu mapa.',
  focus:'Uma primeira leitura ganhou forma.',
  settled:'Seu mapa'
}
