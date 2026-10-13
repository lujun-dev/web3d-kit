/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LIGHT_TINT_CHUNK } from '../core/constants.js';
import { addEffectMesh, createQuadGeometry } from '../core/geometry.js';
import { random, randomBetween } from '../core/math.js';
import { rainLightUniforms } from '../core/util.js';

/* createRain（systems） */
export function createRain() {
  const count = 6000;
  const geometry = createQuadGeometry(-0.5, 0.5, 0, 1);
  const seeds = new Float32Array(count * 4);
  for (let index = 0; index < count; index += 1) {
    seeds[index * 4] = randomBetween(-12, 12);
    seeds[index * 4 + 1] = randomBetween(-12, 12);
    seeds[index * 4 + 2] = random();
    seeds[index * 4 + 3] = random();
  }
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fragmentShader: /* glsl */`
      uniform float uOpacity;
      varying float vAlong;
      varying float vAcross;
      varying vec3 vTint;
      varying float vVisible;
      void main() {
        if (vVisible < 0.01) {
          discard;
        }
        // Thin streaks under MSAA sample varyings outside the quad, so clamp before weighting.
        float core = clamp(1.0 - abs(vAcross) * 2.0, 0.0, 1.0);
        float intensity = core * clamp(1.0 - vAlong, 0.0, 1.0) * vVisible * uOpacity;
        gl_FragColor = vec4(vTint * intensity, 1.0);
      }
    `,
    transparent: true,
    uniforms: { ...rainLightUniforms, uOpacity: { value: 0.55 }, uTime: W.sharedUniforms.uTime },
    vertexShader: /* glsl */`
      uniform float uTime;
      attribute vec4 aSeed;
      varying float vAlong;
      varying float vAcross;
      varying vec3 vTint;
      varying float vVisible;
      ${LIGHT_TINT_CHUNK}
      float getBlockedHeight(vec2 point) {
        if (point.x > -5.3 && point.x < 3.95 && point.y > -8.05 && point.y < 0.45) {
          return point.y > -0.98 ? 3.0 : 4.08;
        }
        if (point.x < -7.0 && point.y > -11.9 && point.y < -1.9) {
          return 7.0;
        }
        if (point.x > 3.8 && point.x < 4.62 && point.y > -6.35 && point.y < -4.2) {
          return 1.9;
        }
        return 0.05;
      }
      void main() {
        float speed = 12.5 + aSeed.w * 5.0;
        float top = 15.0;
        float fall = mod(aSeed.z * top + uTime * speed, top);
        float headY = top - fall;
        vec2 groundPosition = aSeed.xy + vec2(0.09, 0.035) * fall;
        groundPosition = mod(groundPosition + 12.0, 24.0) - 12.0;
        vVisible = step(getBlockedHeight(groundPosition), headY);
        vec3 fallDirection = normalize(vec3(0.09, -1.0, 0.035));
        vec3 head = vec3(groundPosition.x, headY, groundPosition.y);
        float streakLength = 0.45 + aSeed.w * 0.4;
        vec3 toCamera = normalize(cameraPosition - head);
        vec3 side = normalize(cross(fallDirection, toCamera));
        float width = 0.018 + 0.01 * aSeed.w;
        vec3 worldPosition = head - fallDirection * streakLength * position.y + side * position.x * width;
        vTint = computeLightTint(head, vec3(0.26, 0.31, 0.42));
        vAlong = position.y;
        vAcross = position.x;
        float edgeFade = 1.0 - smoothstep(11.2, 12.0, max(abs(groundPosition.x), abs(groundPosition.y)));
        float topFade = 1.0 - smoothstep(top - 3.0, top, headY);
        float nearFade = smoothstep(1.5, 5.0, distance(cameraPosition, head));
        vVisible *= edgeFade * topFade * nearFade;
        gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
      }
    `,
  });
  addEffectMesh(geometry, material);
}
