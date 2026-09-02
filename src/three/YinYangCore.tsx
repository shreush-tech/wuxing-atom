import { MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const TAJITU_VERTEX = /* glsl */`
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const TAJITU_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;

  float aaCircle(vec2 p, float radius){
    float d = length(p) - radius;
    return 1.0 - smoothstep(-0.012, 0.012, d);
  }

  void main(){
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if(r > 1.0) discard;

    // Whole symbol turns continuously while the seam also "breathes" very subtly.
    float globalAngle = uTime * 0.105;
    float ca = cos(globalAngle), sa = sin(globalAngle);
    p = mat2(ca,-sa,sa,ca) * p;

    float breath = 0.5 + 0.030 * sin(uTime * 0.62);
    float yinTop = step(0.0, p.y);
    float upperLobe = aaCircle(p - vec2(0.0, breath), breath);
    float lowerLobe = aaCircle(p - vec2(0.0,-breath), breath);

    // Start with two complementary halves, then invert the two circular lobes.
    float lightRegion = yinTop;
    lightRegion = mix(lightRegion, 0.0, upperLobe);
    lightRegion = mix(lightRegion, 1.0, lowerLobe);

    // Opposite seeds: black inside the white half, white inside the black half.
    float dotRadius = 0.105;
    float upperDot = aaCircle(p - vec2(0.0, 0.50), dotRadius);
    float lowerDot = aaCircle(p - vec2(0.0,-0.50), dotRadius);
    lightRegion = mix(lightRegion, 1.0, upperDot);
    lightRegion = mix(lightRegion, 0.0, lowerDot);

    vec3 yin = vec3(0.012,0.015,0.018);
    vec3 yang = vec3(0.965,0.935,0.845);
    vec3 color = mix(yin, yang, lightRegion);

    // A restrained moving pearl sheen; it never changes the black/white identity.
    float sheen = pow(max(0.0, 1.0 - length(p - vec2(-0.34,0.42))), 5.0);
    float rim = smoothstep(0.91, 1.0, r);
    color += vec3(1.0,0.72,0.28) * (0.045*sheen + 0.018*rim);

    float alpha = uOpacity * (1.0 - smoothstep(0.985,1.0,r));
    gl_FragColor = vec4(color, alpha);
  }
`

export function YinYangCore({reduced=false}:{reduced?:boolean}){
  const group=useRef<THREE.Group>(null!)
  const material=useMemo(()=>new THREE.ShaderMaterial({
    transparent:true,
    depthWrite:false,
    side:THREE.DoubleSide,
    uniforms:{uTime:{value:0},uOpacity:{value:.98}},
    vertexShader:TAJITU_VERTEX,
    fragmentShader:TAJITU_FRAGMENT,
  }),[])

  useFrame((_,dt)=>{
    if(!group.current)return
    if(!reduced){
      material.uniforms.uTime.value += Math.min(dt,.05)
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.sin(material.uniforms.uTime.value*.21)*.10, 2.2, dt)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.cos(material.uniforms.uTime.value*.17)*.045, 2.0, dt)
    }
  })

  return <group ref={group} rotation={[0,0,.10]}>
    {/* two very close faces make the symbol read as an object inside the vessel, not a sticker */}
    <mesh position={[0,0,.055]} scale={[.76,.76,.76]}>
      <circleGeometry args={[1,128]}/>
      <primitive object={material} attach="material"/>
    </mesh>
    <mesh position={[0,0,-.055]} rotation={[0,Math.PI,0]} scale={[.76,.76,.76]}>
      <circleGeometry args={[1,128]}/>
      <primitive object={material} attach="material"/>
    </mesh>

    {/* translucent inner lens gives the Taijitu volume and soft refraction */}
    <mesh scale={[.82,.82,.18]}>
      <sphereGeometry args={[1,48,32]}/>
      <MeshTransmissionMaterial
        color="#f0e3bd"
        transmission={1}
        thickness={.45}
        ior={1.16}
        roughness={.14}
        chromaticAberration={.008}
        anisotropicBlur={.022}
        distortion={.025}
        distortionScale={.05}
        samples={2}
        resolution={64}
      />
    </mesh>
    <mesh rotation={[0,0,.05]}>
      <torusGeometry args={[.825,.012,8,160]}/>
      <meshBasicMaterial color="#e6bd68" transparent opacity={.18} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </mesh>
  </group>
}
