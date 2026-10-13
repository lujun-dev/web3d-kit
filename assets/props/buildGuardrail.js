/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { addCylinder, addRod, addSphere } from '../core/geometry.js';

/* buildGuardrail（props） */
export function buildGuardrail(startX, startZ, endX, endZ) {
  const outlined = W.buckets.outlined;
  const white = { color: '#e9ecef' };
  const length = Math.hypot(endX - startX, endZ - startZ);
  const postCount = Math.max(2, Math.round(length / 1.5) + 1);
  for (let index = 0; index < postCount; index += 1) {
    const t = index / (postCount - 1);
    const x = startX + (endX - startX) * t;
    const z = startZ + (endZ - startZ) * t;
    addCylinder(outlined, [x, LOT_Y + 0.45, z], 0.035, 0.9, white, { segments: 8 });
    addSphere(outlined, [x, LOT_Y + 0.9, z], 0.036, white);
  }
  for (const height of [0.5, 0.85]) {
    addRod(outlined, [startX, LOT_Y + height, startZ], [endX, LOT_Y + height, endZ], 0.03, white, 8);
  }
}
