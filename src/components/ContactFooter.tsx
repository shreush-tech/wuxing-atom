import { siteConfig } from '../content/siteConfig'

export function ContactFooter(){
  const p=siteConfig.practitioner
  const channels=[
    p.whatsapp&&{label:'WhatsApp',href:p.whatsapp},
    p.instagram&&{label:'Instagram',href:p.instagram},
    p.email&&{label:'E-mail',href:`mailto:${p.email}`}
  ].filter(Boolean) as {label:string;href:string}[]

  return <footer className="contact-footer">
    <div>
      <div className="story-kicker">Consulta de acupuntura</div>
      <h2>{p.name}</h2>
      <p>{p.title}{p.city?` · ${p.city}`:''}</p>
    </div>
    <div className="contact-actions">
      {channels.length>0 ? channels.map(c=><a key={c.label} href={c.href} target="_blank" rel="noreferrer">{c.label}</a>) :
        <span className="contact-pending">WhatsApp, Instagram e e-mail podem ser conectados aqui no fechamento do site.</span>}
    </div>
  </footer>
}
