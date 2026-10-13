/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LIGHT_TINT_CHUNK, SPLASH_COUNT, SPLASH_EXTRA, SPLASH_LIFE, SPLASH_SURFACES } from '../core/constants.js';
import { addEffectMesh, createQuadGeometry } from '../core/geometry.js';
import { random } from '../core/math.js';
import { rainLightUniforms } from '../core/util.js';
import { respawnSplash } from './respawnSplash.js';

/* createSplashes（systems） */
export function createSplashes() {
  let total = 0;
  for (const surface of SPLASH_SURFACES) {
    total += (surface.maxX - surface.minX) * (surface.maxZ - surface.minZ);
    W.splashState.cumulativeWeights.push(total);
  }
  W.splashState.totalWeight = total;
  const count = SPLASH_COUNT + SPLASH_EXTRA;
  W.splashState.data = new Float32Array(count * 4);
  for (let index = 0; index < SPLASH_COUNT; index += 1) {
    respawnSplash(index * 4, random() * 0.8);
  }
  for (let index = SPLASH_COUNT; index < count; index += 1) {
    W.splashState.data[index * 4 + 3] = -10;
  }
  const geometry = createQuadGeometry(-1, 1, 0, 1);
  W.splashState.attribute = new THREE.InstancedBufferAttribute(W.splashState.data, 4);
  W.splashState.attribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('aSplash', W.splashState.attribute);
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fragmentShader: /* glsl */`
      varying vec2 vQuad;
      varying float vProgress;
      varying vec3 vTint;
      void main() {
        float shape = 0.0;
        for (int droplet = 0; droplet < 5; droplet++) {
          float spread = (float(droplet) - 2.0) * 0.42;
          vec2 center = vec2(spread * vProgress * 1.1, (0.2 + 0.8 * (1.0 - abs(spread))) * 3.2 * vProgress * (1.0 - vProgress));
          shape += smoothstep(0.14, 0.03, length((vQuad - center) * vec2(1.0, 1.3)));
        }
        float ring = smoothstep(0.1, 0.0, abs(length(vQuad * vec2(1.0, 5.0)) - vProgress * 0.95)) * (1.0 - step(0.22, vQuad.y));
        float intensity = (shape + ring * 0.7) * (1.0 - vProgress);
        gl_FragColor = vec4(vTint * intensity * 0.45, 1.0);
      }
    `,
    transparent: true,
    uniforms: { ...rainLightUniforms, uTime: W.sharedUniforms.uTime },
    vertexShader: /* glsl */`
      uniform float uTime;
      attribute vec4 aSplash;
      varying vec2 vQuad;
      varying float vProgress;
      varying vec3 vTint;
      ${LIGHT_TINT_CHUNK}
      void main() {
        float progress = (uTime - aSplash.w) / ${SPLASH_LIFE.toFixed(2)};
        vProgress = progress;
        vQuad = position.xy;
        vTint = vec3(0.0);
        if (progress < 0.0 || progress > 1.0) {
          gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
          return;
        }
        vec3 cameraRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        float size = 0.15;
        vec3 worldPosition = aSplash.xyz + cameraRight * position.x * size + vec3(0.0, position.y * size * 0.9, 0.0);
        vTint = computeLightTint(aSplash.xyz, vec3(0.3, 0.36, 0.46));
        gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
      }
    `,
  });
  addEffectMesh(geometry, material);
}
