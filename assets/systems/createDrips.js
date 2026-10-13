/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LIGHT_TINT_CHUNK } from '../core/constants.js';
import { addEffectMesh, createQuadGeometry } from '../core/geometry.js';
import { dripSources, rainLightUniforms } from '../core/util.js';
import { registerDripSources } from './registerDripSources.js';

/* createDrips（systems） */
export function createDrips() {
  registerDripSources();
  const count = dripSources.length;
  const geometry = createQuadGeometry(-1, 1, -1, 1);
  W.dripState.data = new Float32Array(count * 4);
  W.dripState.stretch = new Float32Array(count);
  W.dripState.attribute = new THREE.InstancedBufferAttribute(W.dripState.data, 4);
  W.dripState.attribute.setUsage(THREE.DynamicDrawUsage);
  W.dripState.stretchAttribute = new THREE.InstancedBufferAttribute(W.dripState.stretch, 1);
  W.dripState.stretchAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('aDrip', W.dripState.attribute);
  geometry.setAttribute('aStretch', W.dripState.stretchAttribute);
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fragmentShader: /* glsl */`
      varying vec2 vQuad;
      varying vec3 vTint;
      void main() {
        float mask = smoothstep(1.0, 0.2, length(vQuad));
        gl_FragColor = vec4(vTint * mask * 1.3, 1.0);
      }
    `,
    transparent: true,
    uniforms: { ...rainLightUniforms },
    vertexShader: /* glsl */`
      attribute vec4 aDrip;
      attribute float aStretch;
      varying vec2 vQuad;
      varying vec3 vTint;
      ${LIGHT_TINT_CHUNK}
      void main() {
        vQuad = position.xy;
        vTint = vec3(0.0);
        if (aDrip.w <= 0.0) {
          gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
          return;
        }
        vec3 cameraRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        float height = aDrip.w * (1.0 + aStretch);
        vec3 worldPosition = aDrip.xyz + cameraRight * position.x * aDrip.w + vec3(0.0, position.y * height, 0.0);
        vTint = computeLightTint(aDrip.xyz, vec3(0.35, 0.42, 0.55));
        gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
      }
    `,
  });
  addEffectMesh(geometry, material);
}
