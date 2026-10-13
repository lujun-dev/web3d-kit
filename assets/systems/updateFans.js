/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* updateFans（systems） */
export function updateFans(deltaTime) {
  for (const fan of W.fans) {
    fan.mesh.rotation.z += fan.speed * deltaTime;
  }
}
