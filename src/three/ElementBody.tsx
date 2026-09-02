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

const gem:Record<ElementId,{color:string,inner:string,emissive:string,metalness:number,roughness:number,char:string}>= {
  wood:{color:'#356747',inner:'#7aa66f',emissive:'#153823',metalness:.10,roughness:.26,char:'木'},
  fire:{color:'#b84a2b',inner:'#f08a52',emissive:'#7b210f',metalness:.05,roughness:.20,char:'火'},
  earth:{color:'#9a7140',inner:'#d0a65d',emissive:'#3d2910',metalness:.14,roughness:.29,char:'土'},
  metal:{color:'#aeb9bf',inner:'#edf0ee',emissive:'#30383e',metalness:.80,roughness:.15,char:'金'},
  water:{color:'#286985',inner:'#6ba5ba',emissive:'#0a2c40',metalness:.18,roughness:.18,char:'水'},
}

function makeGlyphTexture(char:string){
  const canvas=document.createElement('canvas'); canvas.width=256; canvas.height=256
  const ctx=canvas.getContext('2d')!
  ctx.clearRect(0,0,256,256)
  ctx.textAlign='center';ctx.textBaseline='middle'
  ctx.font='600 154px "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", sans-serif'
  ctx.shadowColor='rgba(255,213,119,.45)';ctx.shadowBlur=18
  ctx.fillStyle='rgba(255,242,204,.94)';ctx.fillText(char,128,134)
  const tex=new THREE.Texture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true
  return tex
}

function Gem({id,onSelect,focused}:{id:ElementId,onSelect:(id:ElementId)=>void,focused:boolean}){
  const g=gem[id], [hovered,setHovered]=useState(false)
  const halo=useRef<THREE.Mesh>(null!), stone=useRef<THREE.Mesh>(null!), ring=useRef<THREE.Mesh>(null!)
  const glyph=useMemo(()=>typeof document!=='undefined'?makeGlyphTexture(g.char):null,[g.char])
  const active=hovered||focused
  useFrame(({clock},dt)=>{
    if(halo.current){
      const target=active?1.10:1
      halo.current.scale.setScalar(THREE.MathUtils.damp(halo.current.scale.x,target,9,dt))
      const mat=halo.current.material as THREE.MeshBasicMaterial
      mat.opacity=THREE.MathUtils.damp(mat.opacity,active?.34:.055,9,dt)
    }
    if(stone.current){
      const target=active?1.045:1
      stone.current.scale.setScalar(THREE.MathUtils.damp(stone.current.scale.x,target,9,dt))
      stone.current.rotation.y+=dt*.055
      stone.current.rotation.z=Math.sin(clock.elapsedTime*.55+id.length)*.022
    }
    if(ring.current){
      ring.current.rotation.z+=dt*(active?.22:.07)
      const m=ring.current.material as THREE.MeshBasicMaterial
      m.opacity=THREE.MathUtils.damp(m.opacity,active?.72:.26,8,dt)
    }
  })
  return <group
    onPointerOver={(e:any)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}}
    onPointerOut={()=>{setHovered(false);document.body.style.cursor=''}}
    onClick={(e:any)=>{e.stopPropagation();onSelect(id)}}
  >
    {/* smooth, cheap aura — deliberately round rather than faceted */}
    <mesh ref={halo} scale={1}>
      <sphereGeometry args={[.91,20,14]}/>
      <meshBasicMaterial color="#e7b957" transparent opacity={.055} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
    {/* faceted jewel: enough facets to feel intentional, still inexpensive */}
    <mesh ref={stone} castShadow={false} receiveShadow={false} rotation={[.08,.18,.04]}>
      <icosahedronGeometry args={[.79,3]}/>
      <meshPhysicalMaterial color={g.color} emissive={g.emissive} emissiveIntensity={active?.66:.40} metalness={g.metalness} roughness={g.roughness} clearcoat={.72} clearcoatRoughness={.18}/>
    </mesh>
    <mesh scale={.72}>
      <icosahedronGeometry args={[.79,1]}/>
      <meshBasicMaterial color={g.inner} transparent opacity={active?.12:.055} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
    <mesh ref={ring} rotation={[1.12,.18,.46]}>
      <torusGeometry args={[.94,.022,6,56]}/>
      <meshBasicMaterial color="#f0c86e" transparent opacity={.26} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
    {glyph&&<sprite position={[0,0,.83]} scale={[.70,.70,1]} renderOrder={8}>
      <spriteMaterial map={glyph} transparent depthTest={false} depthWrite={false} opacity={active?1:.84}/>
    </sprite>}
    <pointLight color="#efc46b" intensity={active?.36:.025} distance={2.1} decay={2}/>
  </group>
}

export function ElementBody({id,state,onSelect,focused=false}:{id:ElementId,state:ElementVisualState,onSelect:(id:ElementId)=>void,waterSegments?:number,focused?:boolean}){
  const carrier=useRef<THREE.Group>(null!)
  const reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  useFrame(({clock},dt)=>{
    const now=clock.getElapsedTime(),d=elementVisualIdentity[id],p=orbitPosition(id,reducedMotion?0:now*.028)
    carrier.current.position.x=THREE.MathUtils.damp(carrier.current.position.x,p.x,4,dt)
    carrier.current.position.y=THREE.MathUtils.damp(carrier.current.position.y,p.y,4,dt)
    carrier.current.position.z=THREE.MathUtils.damp(carrier.current.position.z,p.z,4,dt)
    const presence=.92+state.activity*.07+(focused?.035:0)
    const next=THREE.MathUtils.damp(carrier.current.scale.x,presence,5,dt)
    carrier.current.scale.setScalar(next)
    if(!reducedMotion)carrier.current.rotation.y+=dt*(.010+d.rotation*.010)
  })
  return <group ref={carrier}><Gem id={id} onSelect={onSelect} focused={focused}/></group>
}
