/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { createFanMesh } from './createFanMesh.js';

/* registerFan（systems） */
export function registerFan(position, rotation, localOffset, radius, speed) {
  const pivot = new THREE.Object3D();
  pivot.position.set(position[0], position[1], position[2]);
  pivot.rotation.set(rotation[0], rotation[1], rotation[2]);
  const fan = createFanMesh(radius);
  fan.position.set(localOffset[0], localOffset[1], localOffset[2]);
  pivot.add(fan);
  W.scene.add(pivot);
  W.fans.push({ mesh: fan, speed });
}
