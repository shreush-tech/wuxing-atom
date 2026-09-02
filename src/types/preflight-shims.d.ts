
declare namespace JSX {
  interface IntrinsicAttributes { key?: any }
  interface IntrinsicElements { [elemName: string]: any }
}

declare module 'react' {
  export type ReactNode = any
  export type ErrorInfo = any
  export type ComponentType<P = any> = any
  export type PropsWithChildren<P = any> = P & { children?: any }
  export type RefObject<T = any> = { current: T | null }
  export type MutableRefObject<T = any> = { current: T }
  export const Fragment: any
  export const StrictMode: any
  export class Component<P = any, S = any> {
    props: P
    state: S
    constructor(props: P)
    setState(state: Partial<S>): void
  }
  export function createContext<T>(value: T): any
  export function useContext<T = any>(ctx: any): T
  export function useState<T = any>(value: T): [T, (value: any) => void]
  export function useMemo<T>(fn: () => T, deps: any[]): T
  export function useCallback<T extends (...args:any[])=>any>(fn:T,deps:any[]):T
  export function useEffect(fn:()=>any,deps?:any[]):void
  export function useRef<T>(value: T): MutableRefObject<T>
  export function useRef<T>(value: T | null): RefObject<T>
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>
}

declare module 'react/jsx-runtime' {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module 'react-dom/client' {
  export function createRoot(el:any): { render(node:any):void }
}

declare module 'framer-motion' {
  export const motion: any
  export const AnimatePresence: any
}

declare module 'three' {
  export class Vector2 { [k:string]:any; constructor(...args:any[]) }
  export class Vector3 { [k:string]:any; constructor(...args:any[]) }
  export class Euler { [k:string]:any; constructor(...args:any[]) }
  export class Quaternion { [k:string]:any; constructor(...args:any[]) }
  export class Object3D { [k:string]:any; constructor(...args:any[]) }
  export class Group extends Object3D {}
  export class InstancedMesh<G=any,M=any> extends Mesh<G,M> { instanceMatrix:any; setMatrixAt(index:number,matrix:any):void; frustumCulled:boolean }
  export class Curve<T=any> { getPoint(t:number,target?:T):T; getPointAt(t:number,target?:T):T }
  export class Fog { constructor(color:any,near?:number,far?:number) }
  export class Mesh<G=any,M=any> extends Object3D { geometry:G; material:M }
  export class Points<G=any,M=any> extends Object3D { geometry:G; material:M }
  export class Line<G=any,M=any> extends Object3D { geometry:G; material:M }
  export class PointLight extends Object3D {}
  export class DirectionalLight extends Object3D {}
  export class PerspectiveCamera extends Object3D {}
  export class Material { [k:string]:any }
  export class ShaderMaterial extends Material { constructor(...args:any[]) }
  export class MeshStandardMaterial extends Material { constructor(...args:any[]) }
  export class MeshBasicMaterial extends Material { constructor(...args:any[]) }
  export class BufferAttribute {
  constructor(array:any,itemSize:number)
  setXYZ(index:number,x:number,y:number,z:number):void
  needsUpdate:boolean
}
export class BufferGeometry {
  [k:string]:any
  constructor(...args:any[])
  setAttribute(name:string,attribute:BufferAttribute):this
  getAttribute(name:string):BufferAttribute
}
  export class TubeGeometry extends BufferGeometry { constructor(...args:any[]) }
  export class CatmullRomCurve3 { [k:string]:any; constructor(...args:any[]) }
  export class QuadraticBezierCurve3 { [k:string]:any; constructor(...args:any[]) }
  export class Color { [k:string]:any; constructor(...args:any[]) }
  export class Texture { [k:string]:any; constructor(...args:any[]) }
  export const MathUtils:any
  export const AdditiveBlending:any
  export const DoubleSide:any
  export const BackSide:any
  export const FrontSide:any
  export const NormalBlending:any
  export const DynamicDrawUsage:any
  export const SRGBColorSpace:any
  export const ACESFilmicToneMapping:any
}

declare module '@react-three/fiber' {
  export const Canvas: any
  export function useFrame(cb:any):void
  export function useThree():any
  export type ThreeEvent<T = any> = any
}

declare module '@react-three/drei' {
  export const OrbitControls:any
  export const Float:any
  export const Text:any
  export const Html:any
  export const Environment:any
  export const MeshTransmissionMaterial:any
  export const Points:any
  export const PointMaterial:any
}
