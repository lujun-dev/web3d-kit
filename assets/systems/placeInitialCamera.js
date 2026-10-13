/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';

/* placeInitialCamera（systems） */
export function placeInitialCamera() {
  const aspect = W.viewportWidth / W.viewportHeight;
  const distance = 50 * Math.max(1, Math.pow(1.5 / aspect, 0.85));
  const polar = THREE.MathUtils.degToRad(64);
  const azimuth = THREE.MathUtils.degToRad(36);
  W.camera.position.set(
    W.controls.target.x + distance * Math.sin(polar) * Math.sin(azimuth),
    W.controls.target.y + distance * Math.cos(polar),
    W.controls.target.z + distance * Math.sin(polar) * Math.cos(azimuth),
  );
  W.camera.lookAt(W.controls.target);
  W.controls.update();
}
