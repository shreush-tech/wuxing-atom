import { useMemo, useRef, useState } from 'react'
import { symptoms, primarySymptomIds } from '../clinical/symptoms'
import { useClinical } from '../clinical/store'
import { AdaptiveQuestionCard } from './AdaptiveQuestionCard'
import { SafetyGate } from './SafetyGate'
import { MicroInterview } from './MicroInterview'
import { LowBackDifferentialNote } from './LowBackDifferentialNote'
import { ResultGateway } from './ResultGateway'
import { SimpleJourney } from './SimpleJourney'
import { searchBookIndex } from '../content/bookIndex'
import { searchClinicalDiagnoses } from '../clinical/clinicalDiagnoses'
import { PainQuickCapture } from './PainQuickCapture'

const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')

const groups=[
  {id:'head',label:'Cabeça e sentidos',cats:['cabeca','boca','garganta','neurologico']},
  {id:'chest',label:'Peito e respiração',cats:['peito','respiracao','circulacao']},
  {id:'digestion',label:'Barriga e digestão',cats:['digestao']},
  {id:'bowel',label:'Intestino',cats:['intestino']},
  {id:'energy',label:'Sono e energia',cats:['sono','energia','geral']},
  {id:'pain',label:'Dor e corpo',cats:['dor']},
  {id:'fluids',label:'Temperatura e líquidos',cats:['temperatura','liquidos','ambiente']},
  {id:'emotion',label:'Emocional',cats:['emocional']},
  {id:'uro',label:'Urina e sexual / reprodutivo',cats:['urina','sexual','reprodutivo']},
  {id:'skin',label:'Pele',cats:['pele']},
]

export function SymptomExplorer(){
  const {selected,setAnswer,clinical,clear,clinicalDiagnosisIds,toggleClinicalDiagnosis,clearPainReports}=useClinical()
  const [search,setSearch]=useState('')
  const [showMore,setShowMore]=useState(false)
  const [activeGroup,setActiveGroup]=useState<string|null>(null)
  const [listening,setListening]=useState(false)
  const [voiceNote,setVoiceNote]=useState('')
  const recognitionRef=useRef<any>(null)

  const selectedIds=Object.entries(selected).filter(([,v])=>v==='yes').map(([k])=>k)
  const primary=primarySymptomIds.map(id=>symptoms.find(s=>s.id===id)!).filter(Boolean)
  const searchResults=useMemo(()=>{
    if(!search.trim()) return []
    const q=norm(search)
    const exact=symptoms.filter(s=>s.category!=='seguranca').filter(s=>{const hay=[s.label,...(s.aliases||[])].map(norm).join(' ');return hay.includes(q)||q.includes(norm(s.label))})
    if(q.includes('dor')){const generic=symptoms.find(s=>s.id==='pain_general');if(generic&&!exact.some(x=>x.id===generic.id))exact.unshift(generic)}
    return exact.slice(0,16)
  },[search])
  const referenceResults=useMemo(()=>search.trim()?searchBookIndex(search).slice(0,10):[],[search])
  const spokenDiagnoses=useMemo(()=>search.trim()?searchClinicalDiagnoses(search).slice(0,8):[],[search])
  const groupedSymptoms=useMemo(()=>{
    const g=groups.find(x=>x.id===activeGroup)
    if(!g)return []
    return symptoms.filter(s=>s.category!=='seguranca' && g.cats.includes(s.category)).slice(0,32)
  },[activeGroup])


  const startVoice=()=>{
    const SpeechRecognition=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
    if(!SpeechRecognition){setVoiceNote('Seu navegador não oferece reconhecimento de voz. Você pode continuar digitando normalmente.');return}
    try{
      recognitionRef.current?.stop?.()
      const recognition=new SpeechRecognition()
      recognition.lang='pt-BR';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=1
      recognition.onstart=()=>{setListening(true);setVoiceNote('Ouvindo… descreva o que está sentindo com suas palavras.')}
      recognition.onresult=(event:any)=>{
        let transcript=''
        for(let i=event.resultIndex;i<event.results.length;i++)transcript+=event.results[i][0].transcript
        transcript=transcript.trim();if(transcript){setSearch(transcript);setVoiceNote(`Entendi: “${transcript}”. Veja abaixo os sintomas relacionados e confirme tocando neles.`)}
      }
      recognition.onerror=()=>setVoiceNote('Não consegui entender o áudio. Tente novamente ou use a busca escrita.')
      recognition.onend=()=>setListening(false)
      recognitionRef.current=recognition;recognition.start()
    }catch{setListening(false);setVoiceNote('Não foi possível iniciar o microfone agora.')}
  }
  const goMap=()=>document.getElementById('resultado')?.scrollIntoView({behavior:'smooth',block:'start'})

  return <div className="panel-inner">
    <div className="sheet-handle" aria-hidden="true"></div>
    <div className="panel-head">
      <div className="eyebrow">Sua Medicina Chinesa · leitura educativa</div>
      <h1>Construa sua constelação de sintomas</h1>
      <p className="lead">Selecione sinais e sintomas que você percebe hoje. Dor recebe destaque e pode ser detalhada por local e intensidade.</p>
    </div>

    <div className="panel-scroll">
      <div className="symptom-grid">
        {primary.map(s=><button key={s.id} className={`symptom ${selected[s.id]==='yes'?'selected':''}`} onClick={()=>{const next=selected[s.id]==='yes'?'unknown':'yes';setAnswer(s.id,next);if(s.id==='pain_general'&&next!=='yes')clearPainReports()}}>{s.label}</button>)}
      </div>
      <PainQuickCapture/>

      <button type="button" className="more-symptoms-toggle" onClick={()=>{setShowMore(v=>!v); if(showMore)setActiveGroup(null)}}>
        {showMore?'Fechar outros sintomas':'Outros sintomas +'}
      </button>

      {showMore&&<div className="symptom-categories">
        {groups.map(g=><button key={g.id} className={activeGroup===g.id?'active':''} onClick={()=>setActiveGroup(activeGroup===g.id?null:g.id)}>{g.label}</button>)}
      </div>}

      {showMore&&activeGroup&&<div className="symptom-grid category-results">
        {groupedSymptoms.map(s=><button key={s.id} className={`symptom ${selected[s.id]==='yes'?'selected':''}`} onClick={()=>setAnswer(s.id,selected[s.id]==='yes'?'unknown':'yes')}>{s.label}</button>)}
      </div>}

      <div className="search voice-search">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar sintoma do seu jeito…"/>
        <button type="button" className={`voice-search-button ${listening?'listening':''}`} onClick={startVoice} aria-label="Descrever sintomas por voz" title="Entrevista por voz">
          <span className="voice-mic" aria-hidden="true">●</span><span>{listening?'Ouvindo':'Falar'}</span>
        </button>
      </div>
      <div className="voice-assistant">
        <span className="voice-assistant-badge">Assistente por voz</span>
        <p>{voiceNote||'Toque em Falar e conte sua história. A fala procura sinais, sintomas e diagnósticos clínicos já existentes no banco; você confirma antes de incluir.'}</p>
      </div>
      {search && <div className="symptom-grid search-results">
        {searchResults.map(s=><button key={s.id} className={`symptom ${selected[s.id]==='yes'?'selected':''}`} onClick={()=>setAnswer(s.id,selected[s.id]==='yes'?'unknown':'yes')}>{s.label}</button>)}
      </div>}
      {search && !!spokenDiagnoses.length && <div className="spoken-diagnoses"><div className="section-title">Diagnósticos clínicos reconhecidos na sua fala · confirme se já foram diagnosticados</div><div className="clinical-diagnoses__results">{spokenDiagnoses.map(d=><button key={d.id} className={clinicalDiagnosisIds.includes(d.id)?'diagnosis-chip selected':'diagnosis-chip'} onClick={()=>toggleClinicalDiagnosis(d.id)}>{d.label}</button>)}</div></div>}
      {search && !!referenceResults.length && <div className="reference-index-results">
        <div className="section-title">Condições e sintomas no índice do livro-base</div>
        <div className="reference-index-grid">{referenceResults.map(item=><div key={item.id} className="reference-index-chip"><strong>{item.labelPt}</strong><span>{item.bookLabel}</span></div>)}</div>
        <div className="reference-index-note">Esses termos ampliam a busca e o contexto. Eles não geram um desequilíbrio da Medicina Chinesa automaticamente.</div>
      </div>}

      {!!selectedIds.length && <>
        <div className="section-title">O que você percebe em você · toque para remover</div>
        <div className="selected-tray">
          {selectedIds.map(id=><button key={id} className="chip" onClick={()=>setAnswer(id,'unknown')}>{symptoms.find(s=>s.id===id)?.label} ×</button>)}
          <button className="chip clear" onClick={clear}>limpar</button>
        </div>
        {clinical.interview.canShowResult&&<div className="quick-map-cta">
          <div><strong>Já dá para fazer uma primeira leitura.</strong><span>Você pode parar aqui ou responder mais 3 perguntas.</span></div>
          <button type="button" onClick={goMap}>OK · ver meu equilíbrio</button>
        </div>}
      </>}

      <SafetyGate/>
      <MicroInterview/>
      <LowBackDifferentialNote/>
      <AdaptiveQuestionCard/>
      <SimpleJourney/>
      <ResultGateway/>
      <div className="footer-note">Leitura educativa baseada em padrões da Medicina Chinesa. Não substitui avaliação médica. Quando necessário, a camada de segurança interrompe a experiência antes do resultado.</div>
    </div>
  </div>
}
