// Native WebGL shader shared by the landing atmosphere and the lightweight loading shell.
export const spaceVertex = `attribute vec2 position; varying vec2 vUv;
void main(){vUv=position*0.5+0.5; gl_Position=vec4(position,0.0,1.0);}`;
export const spaceFragment = `precision highp float;
varying vec2 vUv;
uniform float uTime, uAspect;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float field(vec2 p){return noise(p)*0.57+noise(p*2.07+3.1)*0.29+noise(p*4.13+7.6)*0.14;}
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
  vec2 sky=vUv*vec2(uAspect,1.0)*68.0;
  vec2 cell=floor(sky), offset=vec2(hash(cell+3.0),hash(cell+19.0));
  float star=exp(-pow(length(fract(sky)-offset)*24.0,2.0))*step(0.978,hash(cell));
  color+=vec3(0.64,0.70,0.62)*star*(0.68+0.32*sin(uTime*0.28+hash(cell)*6.28));
  float vignette=1.0-smoothstep(0.1,0.95,length(vUv-0.5))*0.34;
  gl_FragColor=vec4(color*vignette,1.0);
}`;
