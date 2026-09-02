export const fireVertex = `
varying vec3 vNormal;
varying vec3 vWorld;
uniform float uTime;
uniform float uHeat;
uniform float uActivity;

float hash(vec3 p){
  p = fract(p * 0.3183099 + .1);
  p *= 17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

float noise(vec3 x){
  vec3 i=floor(x);
  vec3 f=fract(x);
  f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

void main(){
  vNormal = normalize(normalMatrix * normal);
  vec3 p = position;
  float n = noise(normal * 2.4 + vec3(0.0,uTime*.32,0.0));
  float wave = sin((normal.y+uTime*.28)*7.0)*.5+.5;
  float amp = .025 + .055*uHeat + .018*uActivity;
  p += normal * ((n*.7+wave*.3)-.5)*amp;
  vec4 world = modelMatrix * vec4(p,1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const fireFragment = `
varying vec3 vNormal;
varying vec3 vWorld;
uniform float uTime;
uniform float uHeat;
uniform float uExcess;
uniform vec3 uBase;
uniform vec3 uHot;

void main(){
  vec3 V = normalize(cameraPosition-vWorld);
  float fres = pow(1.0-max(dot(normalize(vNormal),V),0.0),2.2);
  float pulse = .5+.5*sin(uTime*(1.6+uHeat*1.2)+vWorld.y*4.0);
  vec3 col = mix(uBase,uHot,clamp(.22+uHeat*.62+pulse*.12,0.0,1.0));
  col += fres*(.18+.42*uHeat);
  float alpha = .74 + fres*.18 + uExcess*.04;
  gl_FragColor = vec4(col,alpha);
}
`;

export const waterVertex = `
varying vec3 vNormal;
varying vec3 vWorld;
varying float vWave;
uniform float uTime;
uniform float uActivity;
uniform float uCold;
uniform float uHeat;

void main(){
  vec3 p=position;
  float w1=sin(p.y*6.2 + uTime*(.72+uActivity*.35));
  float w2=sin((p.x+p.z)*5.0 - uTime*.55);
  float w3=cos(p.z*7.0 + uTime*.42);
  float wave=(w1*.45+w2*.35+w3*.20);
  float amp=.012+.022*uActivity+.010*uHeat;
  p += normal*wave*amp;
  p.y *= 1.0-uCold*.018;
  vWave=wave;
  vNormal=normalize(normalMatrix*normal);
  vec4 world=modelMatrix*vec4(p,1.0);
  vWorld=world.xyz;
  gl_Position=projectionMatrix*viewMatrix*world;
}
`;

export const waterFragment = `
varying vec3 vNormal;
varying vec3 vWorld;
varying float vWave;
uniform vec3 uDeep;
uniform vec3 uLight;
uniform float uCold;
uniform float uHeat;

void main(){
  vec3 V=normalize(cameraPosition-vWorld);
  float fres=pow(1.0-max(dot(normalize(vNormal),V),0.0),3.0);
  float depth=clamp(.45+.22*vWave,0.0,1.0);
  vec3 col=mix(uDeep,uLight,fres*.62 + depth*.18);
  col=mix(col,vec3(.68,.78,.82),uCold*.09);
  col+=vec3(.06,.03,.02)*uHeat;
  float alpha=.78+fres*.18;
  gl_FragColor=vec4(col,alpha);
}
`;

export const woodVertex = `
varying vec3 vNormal;
varying vec3 vWorld;
uniform float uTime;
uniform float uStagnation;
uniform float uActivity;

void main(){
  vec3 p=position;
  float bend=sin((p.y+1.0)*2.6 + uTime*.34)*(.018+.030*uActivity);
  float torsion=sin(p.y*4.0 + uTime*.22)*uStagnation*.030;
  p.x += bend + torsion;
  p.z += cos((p.y+1.0)*2.1 + uTime*.27)*(.014+.018*uActivity);
  vNormal=normalize(normalMatrix*normal);
  vec4 world=modelMatrix*vec4(p,1.0);
  vWorld=world.xyz;
  gl_Position=projectionMatrix*viewMatrix*world;
}
`;

export const woodFragment = `
varying vec3 vNormal;
varying vec3 vWorld;
uniform vec3 uDark;
uniform vec3 uLight;
uniform float uStagnation;

void main(){
  vec3 L=normalize(vec3(.45,.8,.3));
  float ndl=.5+.5*dot(normalize(vNormal),L);
  float grain=.5+.5*sin(vWorld.y*18.0 + vWorld.x*6.0);
  vec3 col=mix(uDark,uLight,ndl*.42+grain*.06);
  col=mix(col,vec3(.16,.23,.16),uStagnation*.12);
  gl_FragColor=vec4(col,1.0);
}
`;
