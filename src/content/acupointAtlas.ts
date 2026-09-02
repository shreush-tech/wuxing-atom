export interface AcupointAtlasEntry {
  id:string
  name:string
  chinese?:string
  region:'hand'|'forearm'|'leg'|'foot'|'wrist'
  x:number
  y:number
  layLocation:string
  note:string
}

export const acupointAtlas:Record<string,AcupointAtlasEntry>={
  ST36:{id:'ST36',name:'Zusanli',chinese:'足三里',region:'leg',x:58,y:45,layLocation:'Na face anterior-lateral da perna, abaixo do joelho.',note:'Use o desenho como orientação inicial; a localização clínica é confirmada pelo profissional.'},
  SP6:{id:'SP6',name:'Sanyinjiao',chinese:'三陰交',region:'leg',x:42,y:72,layLocation:'Na face interna da perna, acima do tornozelo.',note:'Ponto tradicionalmente utilizado em diferentes contextos; a indicação depende do padrão.'},
  LV3:{id:'LV3',name:'Taichong',chinese:'太衝',region:'foot',x:48,y:38,layLocation:'No dorso do pé, entre o primeiro e o segundo metatarsos.',note:'A ilustração é educativa e não substitui localização por palpação.'},
  PC6:{id:'PC6',name:'Neiguan',chinese:'內關',region:'forearm',x:50,y:55,layLocation:'Na face interna do antebraço, acima da dobra do punho.',note:'Pode ser apresentado como ponto de acupressão/Tuiná no conteúdo educativo.'},
  KD3:{id:'KD3',name:'Taixi',chinese:'太谿',region:'foot',x:30,y:55,layLocation:'Na região interna do tornozelo, entre o maléolo medial e o tendão de Aquiles.',note:'Localização esquemática para educação.'},
  HT7:{id:'HT7',name:'Shenmen',chinese:'神門',region:'wrist',x:64,y:70,layLocation:'Na dobra do punho, no lado do dedo mínimo.',note:'Localização esquemática para educação.'}
}
