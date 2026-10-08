// Native WebGL shader shared by the landing atmosphere and the lightweight loading shell.
export const spaceVertex = `attribute vec2 position; varying vec2 vUv;
void main(){vUv=position*0.5+0.5; gl_Position=vec4(position,0.0,1.0);}`;
const skyNoise = `precision highp float;
varying vec2 vUv;
uniform float uTime, uAspect;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*0.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float field(vec2 p){return noise(p)*0.57+noise(p*2.07+3.1)*0.29+noise(p*4.13+7.6)*0.14;}`;
export const spaceFragment = `${skyNoise}
void main(){
  vec2 p=(vUv-0.5)*vec2(uAspect,1.0)*2.4;
  float t=uTime*0.035;
  vec2 warp=vec2(field(p+vec2(t,-t*0.7)),field(p+vec2(-t*0.6,t)+9.2));
  float cloud=field(p+warp*2.2+vec2(t*0.3,-t*0.22));
  float folds=field(p-warp*1.4-vec2(t*0.25,0.0)+14.3);
  float veil=smoothstep(0.20,0.8,vUv.x)*0.5+0.25;
  vec3 color=vec3(0.043,0.063,0.071);
  color=mix(color,vec3(0.20,0.29,0.25),smoothstep(0.28,0.82,cloud)*veil);
  color=mix(color,vec3(0.25,0.20,0.25),smoothstep(0.40,0.86,folds)*0.34);
  float filament=pow(max(0.0,1.0-abs(cloud-folds)*3.2),4.0);
  float dust=smoothstep(0.42,0.78,field(p*2.6+warp*3.0));
  color+=vec3(0.09,0.13,0.10)*filament*smoothstep(0.45,0.8,cloud)*0.18;
  color*=1.0-dust*0.18;
  vec2 sky=vUv*vec2(uAspect,1.0)*68.0;
  vec2 cell=floor(sky), offset=vec2(hash(cell+3.0),hash(cell+19.0));
  float rarity=hash(cell);
  vec2 point=fract(sky)-offset;
  float radius=mix(30.0,17.0,hash(cell+41.0));
  float star=exp(-pow(length(point)*radius,2.0))*step(0.978,rarity);
  float halo=exp(-length(point)*15.0)*step(0.996,rarity)*0.18;
  star+=halo;
  color+=vec3(0.64,0.70,0.62)*star*(0.68+0.32*sin(uTime*0.28+hash(cell)*6.28));
  float vignette=1.0-smoothstep(0.1,0.95,length(vUv-0.5))*0.34;
  gl_FragColor=vec4(color*vignette,1.0);
}`;

// Lesson skies gather light into orbital currents instead of the ambient cloud wash.
export const lessonFragment = `${skyNoise}
void main(){
  vec2 p=(vUv-0.5)*vec2(uAspect,1.0);
  float t=uTime*0.025;
  float cloud=field(p*3.0+vec2(t,-t*0.5));
  vec2 orbit=p*vec2(0.75,1.4);
  float radius=length(orbit);
  float angle=atan(orbit.y,orbit.x);
  float current=pow(0.5+0.5*sin(radius*17.0+sin(angle*2.0)*0.8-cloud*4.0-t),6.0);
  float band=current*smoothstep(0.08,0.25,radius)*(1.0-smoothstep(0.5,1.25,radius));
  vec3 color=vec3(0.043,0.063,0.071);
  color=mix(color,vec3(0.16,0.24,0.22),smoothstep(0.25,0.8,cloud)*0.48);
  color+=mix(vec3(0.12,0.09,0.055),vec3(0.075,0.06,0.12),smoothstep(-0.4,0.5,p.x))*band*0.32;
  vec2 sky=vUv*vec2(uAspect,1.0)*62.0;
  vec2 cell=floor(sky), point=fract(sky)-vec2(hash(cell+7.0),hash(cell+23.0));
  float star=exp(-pow(length(point)*26.0,2.0))*step(0.984,hash(cell));
  color+=vec3(0.66,0.70,0.64)*star*(0.75+0.25*sin(uTime*0.2+hash(cell)*6.28));
  color*=1.0-smoothstep(0.3,1.1,length(p))*0.25;
  gl_FragColor=vec4(color,1.0);
}`;
