/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LAYER_EFFECTS, LOT_Y } from '../core/constants.js';

/* createOverflowStream（systems） */
export function createOverflowStream() {
  const top = new THREE.Vector3(W.overflowStream.x, 2.93, W.overflowStream.z);
  const material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fragmentShader: /* glsl */`
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float core = clamp(1.0 - abs(vUv.x - 0.5) * 2.0, 0.0, 1.0);
        float streak = 0.55 + 0.45 * sin(vUv.y * 90.0 + uTime * 55.0 + sin(vUv.x * 9.0) * 2.0);
        float fade = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
        gl_FragColor = vec4(vec3(0.8, 0.88, 1.05) * core * streak * fade * 0.9, 1.0);
      }
    `,
    transparent: true,
    uniforms: { uLength: { value: 2.93 - LOT_Y }, uTime: W.sharedUniforms.uTime, uTop: { value: top }, uWidth: { value: 0.03 } },
    vertexShader: /* glsl */`
      uniform vec3 uTop;
      uniform float uLength;
      uniform float uWidth;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 toCamera = cameraPosition - uTop;
        toCamera.y = 0.0;
        toCamera = normalize(toCamera + vec3(0.0001));
        vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), toCamera));
        float along = 0.5 - position.y;
        float wobble = sin(along * 14.0 + uTime * 23.0) * 0.004 * along;
        vec3 worldPosition = uTop + side * (position.x * uWidth * (1.0 + along * 0.6) + wobble) + vec3(0.03 * along * along, -along * uLength, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 16), material);
  mesh.frustumCulled = false;
  mesh.layers.set(LAYER_EFFECTS);
  W.scene.add(mesh);
}
