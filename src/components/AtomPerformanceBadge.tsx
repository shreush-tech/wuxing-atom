import {useEffect,useMemo,useState} from 'react'

export function AtomPerformanceBadge(){
 const enabled=useMemo(()=>typeof window!=='undefined' && new URLSearchParams(window.location.search).get('atomTest')==='1',[])
 const [fps,setFps]=useState<number|null>(null)
 useEffect(()=>{
  if(!enabled)return
  let frames=0,last=performance.now(),raf=0
  const loop=(now:number)=>{
    frames++
    if(now-last>=1000){setFps(Math.round(frames*1000/(now-last)));frames=0;last=now}
    raf=requestAnimationFrame(loop)
  }
  raf=requestAnimationFrame(loop)
  return()=>cancelAnimationFrame(raf)
 },[enabled])
 if(!enabled)return null
 return <div className="atom-performance-badge">FPS {fps??'—'} <span>{fps!=null&&fps<40?'reduzir efeitos':'ok'}</span></div>
}
