import {Component, type ErrorInfo, type ReactNode} from 'react'
import {WebGLFallback} from '../three/WebGLFallback'

type Props={children:ReactNode}
type State={failed:boolean}

export class AtomErrorBoundary extends Component<Props,State>{
  state:State={failed:false}
  static getDerivedStateFromError(){ return {failed:true} }
  componentDidCatch(error:Error, info:ErrorInfo){
    if(typeof console!=='undefined') console.error('Wu Xing atom render failure',error,info)
  }
  render(){
    if(this.state.failed) return <div className="scene-shell atom-fallback-shell"><WebGLFallback/></div>
    return this.props.children
  }
}
