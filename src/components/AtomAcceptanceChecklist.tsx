import {useMemo,useState} from 'react'

const items=[
  'O átomo gira sem travar',
  'Pinça/scroll aproxima sem saltos',
  'Toque em um elemento foca corretamente',
  'Recentrar restaura a composição',
  'Vários elementos podem ficar ativos juntos',
  'Relação não aparece com um único sintoma',
  'Retirar sintoma enfraquece a resposta visual',
  'Painel não cobre o átomo no celular'
]

export function AtomAcceptanceChecklist(){
  const enabled=useMemo(()=>typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('atomTest')==='1',[])
  const [done,setDone]=useState<Record<number,boolean>>({})
  if(!enabled)return null
  const total=Object.values(done).filter(Boolean).length
  return <details className="atom-acceptance-checklist">
    <summary>Checklist do átomo · {total}/{items.length}</summary>
    {items.map((item,i)=><label key={item}>
      <input type="checkbox" checked={!!done[i]} onChange={e=>setDone(v=>({...v,[i]:e.target.checked}))}/>
      <span>{item}</span>
    </label>)}
  </details>
}
