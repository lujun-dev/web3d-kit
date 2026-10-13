/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { addEffectMesh, createQuadGeometry } from '../core/geometry.js';
import { random } from '../core/math.js';

/* createSteam（systems） */
export function createSteam(origin, count, rise, spread, size, opacity) {
  const geometry = createQuadGeometry(-1, 1, -1, 1);
  const seeds = new Float32Array(count * 2);
  for (let index = 0; index < count; index += 1) {
    seeds[index * 2] = random();
    seeds[index * 2 + 1] = random();
  }
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 2));
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fragmentShader: /* glsl */`
      uniform float uOpacity;
      varying vec2 vQuad;
      varying float vAlpha;
      void main() {
        float blob = smoothstep(1.0, 0.0, length(vQuad));
        gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * blob * blob * vAlpha * uOpacity, 1.0);
      }
    `,
    transparent: true,
    uniforms: { uOpacity: { value: opacity }, uRise: { value: rise }, uSize: { value: size }, uSpread: { value: spread }, uTime: W.sharedUniforms.uTime },
    vertexShader: /* glsl */`
      uniform float uTime;
      uniform float uRise;
      uniform float uSpread;
      uniform float uSize;
      attribute vec2 aSeed;
      varying vec2 vQuad;
      varying float vAlpha;
      void main() {
        float life = 2.4 + aSeed.y * 1.2;
        float progress = fract(uTime / life + aSeed.x);
        vec3 offset = vec3(sin(progress * 5.0 + aSeed.y * 9.0) * uSpread * progress, progress * uRise, cos(progress * 4.0 + aSeed.x * 7.0) * uSpread * progress);
        vec4 viewCenter = modelViewMatrix * vec4(offset, 1.0);
        viewCenter.xy += position.xy * uSize * (0.35 + progress * 1.3);
        vQuad = position.xy;
        vAlpha = smoothstep(0.0, 0.15, progress) * (1.0 - progress);
        gl_Position = projectionMatrix * viewCenter;
      }
    `,
  });
  const mesh = addEffectMesh(geometry, material);
  mesh.position.set(origin[0], origin[1], origin[2]);
}
