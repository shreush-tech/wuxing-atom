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
  return anchor.clone().add(new THREE.Vector3(Math.sin(t*.72+phase)*.016,Math.cos(t*.61+phase)*.010,Math.sin(t*.53+phase)*.016))
}

const gem:Record<ElementId,{base:string,light:string,dark:string,emissive:string,metalness:number,roughness:number,char:string}>= {
  wood:{base:'#194b2d',light:'#5d9a55',dark:'#092418',emissive:'#123e25',metalness:.08,roughness:.34,char:'木'},
  fire:{base:'#a82d19',light:'#ef6b35',dark:'#3f0e08',emissive:'#7a1609',metalness:.03,roughness:.25,char:'火'},
  earth:{base:'#7b4d20',light:'#c28b43',dark:'#301a0b',emissive:'#4a260d',metalness:.12,roughness:.38,char:'土'},
  metal:{base:'#707b80',light:'#e1e7e7',dark:'#242b2f',emissive:'#313b40',metalness:.82,roughness:.18,char:'金'},
  water:{base:'#064b6b',light:'#2c8eb2',dark:'#031e30',emissive:'#063a55',metalness:.16,roughness:.20,char:'水'},
}

function seededNoise(x:number,y:number,seed:number){const v=Math.sin(x*12.9898+y*78.233+seed*37.719)*43758.5453;return v-Math.floor(v)}
function makePlanetTexture(id:ElementId){
  const g=gem[id], canvas=document.createElement('canvas');canvas.width=256;canvas.height=128
  const ctx=canvas.getContext('2d')!, grad=ctx.createLinearGradient(0,0,256,128)
  grad.addColorStop(0,g.dark);grad.addColorStop(.34,g.base);grad.addColorStop(.7,g.light);grad.addColorStop(1,g.dark)
  ctx.fillStyle=grad;ctx.fillRect(0,0,256,128)
  const seed=id.length*17+id.charCodeAt(0)
  for(let y=0;y<128;y+=2){
    const band=.5+.5*Math.sin(y*.15+seed*.08)+.25*Math.sin(y*.047)
    ctx.fillStyle=`rgba(255,236,188,${.012+band*.014})`;ctx.fillRect(0,y,256,1)
  }
  for(let i=0;i<420;i++){
    const x=seededNoise(i,3,seed)*256,y=seededNoise(i,7,seed)*128,r=.4+seededNoise(i,11,seed)*1.8
    ctx.fillStyle=seededNoise(i,13,seed)>.5?'rgba(255,255,255,.032)':'rgba(0,0,0,.05)'
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()
  }
  if(id==='metal'){
    ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=1
    for(let i=0;i<14;i++){ctx.beginPath();ctx.moveTo(i*21-40,0);ctx.lineTo(i*21+55,128);ctx.stroke()}
  }
  const tex=new THREE.Texture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true
  return tex
}
function makeGlyphTexture(char:string){
  const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256
  const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,256,256);ctx.textAlign='center';ctx.textBaseline='middle'
  ctx.font='600 154px "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", sans-serif'
  ctx.shadowColor='rgba(255,211,117,.65)';ctx.shadowBlur=20;ctx.fillStyle='rgba(255,242,207,.96)';ctx.fillText(char,128,134)
  const tex=new THREE.Texture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex
}

function PlanetGem({id,onSelect,focused}:{id:ElementId,onSelect:(id:ElementId)=>void,focused:boolean}){
  const g=gem[id],[hovered,setHovered]=useState(false),active=hovered||focused
  const aura=useRef<THREE.Mesh>(null!),stone=useRef<THREE.Mesh>(null!),ring=useRef<THREE.Mesh>(null!),shine=useRef<THREE.Mesh>(null!)
  const glyph=useMemo(()=>typeof document!=='undefined'?makeGlyphTexture(g.char):null,[g.char])
  const texture=useMemo(()=>typeof document!=='undefined'?makePlanetTexture(id):null,[id])
  useFrame(({clock},dt)=>{
    if(stone.current){
      const scale=THREE.MathUtils.damp(stone.current.scale.x,active?1.055:1,10,dt);stone.current.scale.setScalar(scale)
      stone.current.rotation.y+=dt*(active?.12:.035);stone.current.rotation.z=Math.sin(clock.elapsedTime*.42+id.length)*.018
    }
    if(aura.current){const m=aura.current.material as THREE.MeshBasicMaterial;m.opacity=THREE.MathUtils.damp(m.opacity,active?.20:.035,9,dt);aura.current.scale.setScalar(THREE.MathUtils.damp(aura.current.scale.x,active?1.16:1.04,8,dt))}
    if(ring.current){ring.current.rotation.z+=dt*(active?.18:.045);const m=ring.current.material as THREE.MeshBasicMaterial;m.opacity=THREE.MathUtils.damp(m.opacity,active?.82:.28,8,dt)}
    if(shine.current){shine.current.position.x=Math.sin(clock.elapsedTime*.31+id.length)*.06;shine.current.position.y=.28+Math.cos(clock.elapsedTime*.28+id.length)*.025}
  })
  return <group onPointerOver={(e:any)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHovered(false);document.body.style.cursor=''}} onClick={(e:any)=>{e.stopPropagation();onSelect(id)}}>
    <mesh ref={aura}><sphereGeometry args={[.94,24,16]}/><meshBasicMaterial color="#efc75d" transparent opacity={.035} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={stone} rotation={[.05,.15,.02]}>
      <sphereGeometry args={[.79,28,20]}/><meshPhysicalMaterial map={texture||undefined} color={g.base} emissive={g.emissive} emissiveIntensity={active?.55:.25} metalness={g.metalness} roughness={g.roughness} clearcoat={.82} clearcoatRoughness={.16}/>
    </mesh>
    <mesh scale={.70}><sphereGeometry args={[.79,20,14]}/><meshBasicMaterial color={g.light} transparent opacity={active?.075:.035} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh scale={1.018}><sphereGeometry args={[.79,24,16]}/><meshPhysicalMaterial color={g.light} transparent opacity={.055} roughness={.08} metalness={.08} depthWrite={false}/></mesh>
    <mesh ref={shine} position={[-.28,.30,.68]}><sphereGeometry args={[.105,12,8]}/><meshBasicMaterial color="#fff8dc" transparent opacity={.72} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    <mesh ref={ring} rotation={[1.12,.18,.46]}><torusGeometry args={[.94,.024,7,64]}/><meshBasicMaterial color="#f0c86e" transparent opacity={.28} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
    {glyph&&<sprite position={[0,0,.81]} scale={[.68,.68,1]} renderOrder={8}><spriteMaterial map={glyph} transparent depthTest={false} depthWrite={false} opacity={active?1:.86}/></sprite>}
    <pointLight color="#efc46b" intensity={active?.28:.015} distance={1.9} decay={2}/>
  </group>
}

export function ElementBody({id,state,onSelect,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!), reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.028)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,4,dt);carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,4,dt);carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,4,dt)
    const presence=.92+state.activity*.07+(focused?.035:0),next=THREE.MathUtils.damp(carrier.current.scale.x,presence,5,dt);carrier.current.scale.setScalar(next)
    if(!reducedMotion)carrier.current.rotation.y+=dt*(.006+d.rotation*.006)
  })
  return <group ref={carrier}><PlanetGem id={id} onSelect={onSelect} focused={focused}/></group>
}
