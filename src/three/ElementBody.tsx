import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ElementId, ElementVisualState } from '../clinical/types'
import { elementVisualIdentity } from '../content/elementVisualIdentity'

const canonicalAnchors:Record<ElementId,THREE.Vector3>={
  fire:new THREE.Vector3(0,2.78,.14), earth:new THREE.Vector3(2.62,.82,-.18), metal:new THREE.Vector3(1.64,-2.24,.16),
  water:new THREE.Vector3(-1.64,-2.24,-.12), wood:new THREE.Vector3(-2.62,.82,.22),
}
const driftPhase:Record<ElementId,number>={fire:.2,earth:1.4,metal:2.7,water:4.0,wood:5.2}
export function orbitPosition(id:ElementId,t:number){
  const anchor=canonicalAnchors[id],phase=driftPhase[id]
  return anchor.clone().add(new THREE.Vector3(Math.sin(t*.72+phase)*.018,Math.cos(t*.61+phase)*.012,Math.sin(t*.53+phase)*.018))
}

const gem:Record<ElementId,{base:string,light:string,dark:string,emissive:string,atmosphere:string,metalness:number,roughness:number,char:string}>= {
  wood:{base:'#153d25',light:'#6da35d',dark:'#06170e',emissive:'#0d321c',atmosphere:'#79c875',metalness:.04,roughness:.43,char:'木'},
  fire:{base:'#8f2113',light:'#ff7440',dark:'#250603',emissive:'#751306',atmosphere:'#ff9a54',metalness:.02,roughness:.30,char:'火'},
  earth:{base:'#6b431e',light:'#bd8540',dark:'#211006',emissive:'#3c200c',atmosphere:'#d3a45f',metalness:.10,roughness:.44,char:'土'},
  metal:{base:'#616b70',light:'#edf1ed',dark:'#171d20',emissive:'#283238',atmosphere:'#e9f1ee',metalness:.72,roughness:.24,char:'金'},
  water:{base:'#063f5c',light:'#35a0c8',dark:'#01131f',emissive:'#04314a',atmosphere:'#58c7ef',metalness:.12,roughness:.26,char:'水'},
}

function seededNoise(x:number,y:number,seed:number){const v=Math.sin(x*12.9898+y*78.233+seed*37.719)*43758.5453;return v-Math.floor(v)}
function makePlanetTexture(id:ElementId){
  const g=gem[id], canvas=document.createElement('canvas');canvas.width=384;canvas.height=192
  const ctx=canvas.getContext('2d')!,rad=ctx.createRadialGradient(138,58,8,190,96,230)
  rad.addColorStop(0,g.light);rad.addColorStop(.22,g.base);rad.addColorStop(.72,g.dark);rad.addColorStop(1,'#020304')
  ctx.fillStyle=rad;ctx.fillRect(0,0,384,192)
  const seed=id.length*43+id.charCodeAt(0)
  for(let y=0;y<192;y+=2){
    const band=.55+.34*Math.sin(y*.085+seed*.11)+.18*Math.sin(y*.031+seed)
    const a=id==='water'?.018+band*.025:id==='fire'?.014+band*.020:.010+band*.016
    ctx.fillStyle=`rgba(255,229,165,${a})`;ctx.fillRect(0,y,384,1)
  }
  for(let i=0;i<34;i++){
    const x=seededNoise(i,7,seed)*384,y=seededNoise(i,11,seed)*192,r=6+seededNoise(i,17,seed)*32
    const glow=ctx.createRadialGradient(x,y,0,x,y,r)
    const bright=seededNoise(i,19,seed)>.55
    glow.addColorStop(0,bright?'rgba(255,238,188,.055)':'rgba(0,0,0,.12)');glow.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()
  }
  if(id==='metal'){
    ctx.strokeStyle='rgba(255,255,255,.085)';ctx.lineWidth=1
    for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(i*38-120,0);ctx.lineTo(i*38+40,192);ctx.stroke()}
  }
  if(id==='fire'){
    for(let i=0;i<7;i++){const y=30+i*23;ctx.strokeStyle=`rgba(255,118,50,${.035+i*.004})`;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(95,y-18,210,y+20,384,y-5);ctx.stroke()}
  }
  if(id==='wood'){
    ctx.strokeStyle='rgba(130,196,112,.06)';ctx.lineWidth=2
    for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(i*55,192);ctx.bezierCurveTo(i*44,120,i*70,70,i*51,0);ctx.stroke()}
  }
  const tex=new THREE.Texture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true
  return tex
}
function makeGlyphTexture(char:string){
  const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256
  const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,256,256);ctx.textAlign='center';ctx.textBaseline='middle'
  ctx.font='600 146px "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", sans-serif'
  ctx.shadowColor='rgba(255,216,132,.42)';ctx.shadowBlur=16;ctx.fillStyle='rgba(255,244,214,.94)';ctx.fillText(char,128,134)
  const tex=new THREE.Texture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex
}

function PlanetGem({id,onSelect,focused}:{id:ElementId,onSelect:(id:ElementId)=>void,focused:boolean}){
  const g=gem[id],[hovered,setHovered]=useState(false),active=hovered||focused
  const root=useRef<THREE.Group>(null!),stone=useRef<THREE.Mesh>(null!),atmosphere=useRef<THREE.Mesh>(null!),ring=useRef<THREE.Mesh>(null!),shine=useRef<THREE.Mesh>(null!),halo=useRef<THREE.Mesh>(null!)
  const glyph=useMemo(()=>typeof document!=='undefined'?makeGlyphTexture(g.char):null,[g.char])
  const texture=useMemo(()=>typeof document!=='undefined'?makePlanetTexture(id):null,[id])
  useFrame(({clock},dt)=>{
    const t=clock.elapsedTime
    if(root.current){const target=active?1.055:1;const s=THREE.MathUtils.damp(root.current.scale.x,target,9,dt);root.current.scale.setScalar(s);root.current.rotation.z=Math.sin(t*.31+id.length)*.010}
    if(stone.current){stone.current.rotation.y+=dt*(active?.10:.025);stone.current.rotation.x=.03+Math.sin(t*.17+id.length)*.006}
    if(atmosphere.current){const m=atmosphere.current.material as THREE.MeshBasicMaterial;m.opacity=THREE.MathUtils.damp(m.opacity,active?.13:.045,8,dt)}
    if(halo.current){const m=halo.current.material as THREE.MeshBasicMaterial;m.opacity=THREE.MathUtils.damp(m.opacity,active?.15:.018,8,dt);halo.current.scale.setScalar(1.04+Math.sin(t*1.15+id.length)*.012+(active?.05:0))}
    if(ring.current){ring.current.rotation.z+=dt*(active?.13:.026);const m=ring.current.material as THREE.MeshBasicMaterial;m.opacity=THREE.MathUtils.damp(m.opacity,active?.46:.10,7,dt)}
    if(shine.current){shine.current.position.x=-.24+Math.sin(t*.27+id.length)*.035;shine.current.position.y=.29+Math.cos(t*.23+id.length)*.020}
  })
  return <group ref={root} onPointerOver={(e:any)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHovered(false);document.body.style.cursor=''}} onClick={(e:any)=>{e.stopPropagation();onSelect(id)}}>
    <mesh ref={halo} scale={1.04}><sphereGeometry args={[.91,24,18]}/><meshBasicMaterial color={g.atmosphere} transparent opacity={.018} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={atmosphere} scale={1.015}><sphereGeometry args={[.82,28,20]}/><meshBasicMaterial color={g.atmosphere} transparent opacity={.045} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={stone} rotation={[.04,.10,.01]}>
      <sphereGeometry args={[.79,32,24]}/><meshPhysicalMaterial map={texture||undefined} color={g.base} emissive={g.emissive} emissiveIntensity={active?.48:.18} metalness={g.metalness} roughness={g.roughness} clearcoat={.74} clearcoatRoughness={.14}/>
    </mesh>
    <mesh scale={.76}><sphereGeometry args={[.79,20,14]}/><meshBasicMaterial color={g.light} transparent opacity={active?.052:.018} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={shine} position={[-.24,.29,.69]}><sphereGeometry args={[.090,10,7]}/><meshBasicMaterial color="#fff8df" transparent opacity={.76} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh position={[.27,.10,.72]}><sphereGeometry args={[.028,7,5]}/><meshBasicMaterial color="#ffe5a0" transparent opacity={.58} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={ring} rotation={[1.10,.18,.46]}><torusGeometry args={[.91,.014,6,72]}/><meshBasicMaterial color="#e6b653" transparent opacity={.10} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    {glyph&&<sprite position={[0,0,.81]} scale={[.64,.64,1]} renderOrder={8}><spriteMaterial map={glyph} transparent depthTest={false} depthWrite={false} opacity={active?1:.82}/></sprite>}
    <pointLight color={g.atmosphere} intensity={active?.20:.008} distance={1.7} decay={2}/>
  </group>
}

export function ElementBody({id,state,onSelect,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!), reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.032)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,4,dt);carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,4,dt);carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,4,dt)
    const presence=.92+state.activity*.07+(focused?.035:0),next=THREE.MathUtils.damp(carrier.current.scale.x,presence,5,dt);carrier.current.scale.setScalar(next)
    if(!reducedMotion)carrier.current.rotation.y+=dt*(.004+d.rotation*.004)
  })
  return <group ref={carrier}><PlanetGem id={id} onSelect={onSelect} focused={focused}/></group>
}
