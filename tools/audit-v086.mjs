import fs from 'node:fs'
import path from 'node:path'

const root=path.resolve(process.cwd())
const read=p=>fs.readFileSync(path.join(root,p),'utf8')
const allFiles=(dir)=>{
  const res=[]
  for(const n of fs.readdirSync(path.join(root,dir))){
    const p=path.join(dir,n),abs=path.join(root,p)
    if(fs.statSync(abs).isDirectory())res.push(...allFiles(p))
    else res.push(p)
  }
  return res
}
const srcFiles=allFiles('src').filter(f=>/\.(ts|tsx|json|css)$/.test(f))
const text=srcFiles.map(f=>read(f)).join('\n')
const checks=[]
const ok=(name,pass,detail='')=>checks.push({name,pass,detail})

ok('No patient-facing "Interações em evidência"',!text.includes('Interações em evidência'))
ok('No visible automassagem terminology',!text.toLowerCase().includes('automassagem'))
ok('Yin-Yang opposite seeds implemented',read('src/three/YinYangCore.tsx').includes('upperDot')&&read('src/three/YinYangCore.tsx').includes('lowerDot'))
ok('Yin-Yang educational panel mounted',read('src/App.tsx').includes('YinYangInfoPanel'))
ok('Core is clickable',read('src/three/Core.tsx').includes('wuxing-core-explore'))
ok('Invisible relationship tap target removed from Scene',!read('src/three/Scene.tsx').includes('RelationshipTapTarget'))
ok('Fire canonical apex',read('src/three/ElementBody.tsx').includes("fire:new THREE.Vector3(0,2.78"))
ok('Transmission resolution scaled by quality tier',read('src/three/Scene.tsx').includes('transmissionResolutionScale'))
ok('ACES filmic tone mapping enabled',read('src/three/Scene.tsx').includes('ACESFilmicToneMapping'))
ok('Element education integrated',read('src/content/theoryEducation.ts').includes("name:'Fogo'")&&read('src/content/theoryEducation.ts').includes("name:'Água'"))
ok('Pulse/tongue excluded statement retained',read('src/clinical/patterns.ts').includes('Pulse and tongue findings are deliberately excluded'))
ok('Clinical diagnosis direct pattern/element weighting remains absent',!read('src/clinical/clinicalDiagnoses.ts').includes('directElementWeight:1')&&!read('src/clinical/clinicalDiagnoses.ts').includes('directImbalanceWeight:1'))

const failures=checks.filter(x=>!x.pass)
console.log(JSON.stringify({checks,passed:checks.length-failures.length,total:checks.length,failures},null,2))
process.exit(failures.length?1:0)
