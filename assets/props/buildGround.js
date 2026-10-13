/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from '../core/world.js';
import { LAYER_GROUND } from '../core/constants.js';
import { createGroundMaterial } from '../core/materials.js';
import { createGroundGeometry, drawGroundAlbedo, drawWetMask } from '../scene/index.js';

/* buildGround（props） */
export function buildGround() {
  const material = createGroundMaterial(drawGroundAlbedo(), drawWetMask());
  const mesh = new THREE.Mesh(createGroundGeometry(), material);
  mesh.receiveShadow = true;
  mesh.layers.set(LAYER_GROUND);
  W.scene.add(mesh);
}
