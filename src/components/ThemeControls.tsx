import {useEffect,useState} from 'react'
import {defaultTheme,themePresets,type ThemePreset} from '../content/themePresets'

const themeExtras:Record<ThemePreset,{muted:string;line:string;panel:string;shadow:string}>={
  darkGallery:{muted:'rgba(238,240,237,.60)',line:'rgba(255,255,255,.10)',panel:'rgba(14,18,22,.88)',shadow:'0 28px 90px rgba(0,0,0,.42)'},
  mineral:{muted:'#777267',line:'rgba(36,35,31,.14)',panel:'rgba(246,243,236,.88)',shadow:'0 28px 80px rgba(38,34,26,.10)'},
  charcoal:{muted:'rgba(241,241,238,.58)',line:'rgba(255,255,255,.10)',panel:'rgba(29,32,36,.90)',shadow:'0 28px 90px rgba(0,0,0,.38)'},
}

export function ThemeControls(){
 const [theme,setTheme]=useState<ThemePreset>(defaultTheme)
 const apply=(id:ThemePreset)=>{
   setTheme(id)
   const t=themePresets[id]
   const x=themeExtras[id]
   const root=document.documentElement
   root.style.setProperty('--user-bg',t.background)
   root.style.setProperty('--user-surface',t.surface)
   root.style.setProperty('--user-ink',t.text)
   // Legacy design tokens are still consumed by the patient surface.
   root.style.setProperty('--bg',t.background)
   root.style.setProperty('--ink',t.text)
   root.style.setProperty('--muted',x.muted)
   root.style.setProperty('--line',x.line)
   root.style.setProperty('--panel',x.panel)
   root.style.setProperty('--shadow',x.shadow)
   root.dataset.theme=id
   window.dispatchEvent(new CustomEvent('wuxing-theme-change',{detail:{id,background:t.background}}))
 }
 useEffect(()=>apply(defaultTheme),[])
 return <div className="theme-controls" aria-label="Aparência">
   {(Object.keys(themePresets) as ThemePreset[]).map(id=>
     <button type="button" key={id} aria-pressed={theme===id} title={`Fundo ${themePresets[id].label}`} onClick={()=>apply(id)}>
       <span className="theme-dot" style={{background:themePresets[id].background}}/>
       <span className="theme-label">{themePresets[id].label}</span>
     </button>)}
 </div>
}
