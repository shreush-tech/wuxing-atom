export function queryFlag(name:string){
 if(typeof window==='undefined')return false
 return new URLSearchParams(window.location.search).get(name)==='1'
}
