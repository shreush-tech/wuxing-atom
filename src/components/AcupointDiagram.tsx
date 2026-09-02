import type { AcupointAtlasEntry } from '../content/acupointAtlas'

const silhouettes={
  leg:'M42 4 C48 4 52 8 52 16 L58 94 C58 98 54 100 50 100 L42 100 C38 100 36 97 37 92 L40 17 C40 9 40 5 42 4Z',
  foot:'M25 12 C34 8 48 10 55 19 C60 27 61 45 66 61 C70 72 80 78 88 82 C92 84 92 90 87 93 C77 99 58 96 45 92 C33 88 22 81 18 70 C14 58 17 42 19 29 C20 21 21 15 25 12Z',
  forearm:'M38 4 C47 3 54 8 55 17 L63 93 C64 98 59 100 53 100 L39 100 C34 100 31 97 32 92 L35 18 C35 10 36 5 38 4Z',
  wrist:'M31 10 C42 6 60 7 69 12 L72 91 C62 96 39 96 29 91Z',
  hand:'M30 20 C39 12 59 12 69 20 L77 78 C69 90 35 91 23 78Z'
}

export function AcupointDiagram({point}:{point:AcupointAtlasEntry}){
  const path=silhouettes[point.region]||silhouettes.leg
  return <svg className="point-diagram" viewBox="0 0 100 105" role="img" aria-label={`Diagrama esquemático de ${point.id}`}>
    <path d={path} className="body-shape"/>
    <line x1={point.x} y1={point.y} x2={88} y2={20} className="point-line"/>
    <circle cx={point.x} cy={point.y} r="3.4" className="point-dot"/>
    <circle cx={point.x} cy={point.y} r="7" className="point-ring"/>
    <text x="88" y="17" textAnchor="end" className="point-code">{point.id}</text>
  </svg>
}
