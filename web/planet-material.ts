import { AdditiveBlending, Color, MeshStandardMaterial, ShaderMaterial } from 'three';

export function planetMaterial(seed: number) {
  const material = new MeshStandardMaterial({ color: '#82968c', roughness: .92, emissive: '#26362e', emissiveIntensity: .12 });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSeed = { value: seed * 3.17 };
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vTerrain;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvTerrain=position;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vTerrain;
      uniform float uSeed;
      float hashTerrain(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
      float terrain(vec3 p){vec3 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(hashTerrain(i),hashTerrain(i+vec3(1,0,0)),f.x),mix(hashTerrain(i+vec3(0,1,0)),hashTerrain(i+vec3(1,1,0)),f.x),f.y),
        mix(mix(hashTerrain(i+vec3(0,0,1)),hashTerrain(i+vec3(1,0,1)),f.x),mix(hashTerrain(i+vec3(0,1,1)),hashTerrain(i+vec3(1,1,1)),f.x),f.y),f.z);}
    `).replace('#include <color_fragment>', `#include <color_fragment>
      vec3 p=normalize(vTerrain);
      float continents=terrain(p*4.0+uSeed);
      float detail=terrain(p*21.0+continents*2.0);
      diffuseColor.rgb *= .42+continents*.68+detail*.22;
    `);
  };
  material.customProgramCacheKey = () => 'observatory-terrain-v1';
  return material;
}

export function atmosphereMaterial(color = '#9bb7a5') {
  return new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(color) }, uOpacity: { value: .28 } },
    vertexShader: `varying vec3 vNormal,vView;
      void main(){vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p;}`,
    fragmentShader: `varying vec3 vNormal,vView; uniform vec3 uColor; uniform float uOpacity;
      void main(){float rim=pow(1.0-clamp(dot(normalize(vNormal),normalize(vView)),0.0,1.0),3.0); gl_FragColor=vec4(uColor,rim*uOpacity);
      #include <colorspace_fragment>
      }`,
  });
}
