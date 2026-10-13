/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { FACE, LOT_Y } from '../core/constants.js';
import { addBlock, addShrub } from '../core/geometry.js';
import { random, randomBetween } from '../core/math.js';

/* buildPlanters（props） */
export function buildPlanters() {
  const outlined = W.buckets.outlined;
  addBlock(outlined, [-11.95, LOT_Y, 11.5], [11.95, LOT_Y + 0.25, 11.95], { color: '#8d8f96', faces: { [FACE.py]: { color: '#3e3329' } } });
  addBlock(outlined, [11.5, LOT_Y, -11.95], [11.95, LOT_Y + 0.25, 4.5], { color: '#8d8f96', faces: { [FACE.py]: { color: '#3e3329' } } });
  for (let x = -11.6; x <= 11.6; x += randomBetween(0.5, 0.72)) {
    addShrub(x, 11.72, randomBetween(0.25, 0.34), random() < 0.3);
  }
  for (let z = -11.6; z <= 4.2; z += randomBetween(0.5, 0.72)) {
    addShrub(11.72, z, randomBetween(0.25, 0.34), random() < 0.3);
  }
}
