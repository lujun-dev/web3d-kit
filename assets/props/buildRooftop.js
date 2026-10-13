/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { COLORS } from '../core/constants.js';
import { addBlock, addCylinder, addPanel, addRod } from '../core/geometry.js';
import { randomBetween } from '../core/math.js';
import { registerFan } from '../systems/registerFan.js';

/* buildRooftop（props） */
export function buildRooftop() {
  const outlined = W.buckets.outlined;
  for (const x of [-2.9, -1.1]) {
    addBlock(outlined, [x - 0.65, 3.55, -6.2], [x + 0.65, 3.62, -5.2], { color: COLORS.metal });
    addBlock(outlined, [x - 0.6, 3.62, -6.15], [x + 0.6, 4.45, -5.25], { color: '#e3e4df' });
    addPanel(W.buckets.cutout, [x, 4.48, -5.7], 0.62, 0.62, '+y', { map: W.atlasRects.acGrill });
    addCylinder(outlined, [x, 4.452, -5.7], 0.3, 0.004, { color: '#23262b' }, { segments: 20 });
    registerFan([x, 4.465, -5.7], [-Math.PI / 2, 0, 0], [0, 0, 0], 0.27, randomBetween(4, 6));
  }
  addBlock(outlined, [-3.6, 3.55, -5.0], [-3.3, 3.8, -1.6], { color: '#c9ccd1' });
  addBlock(outlined, [1.6, 3.55, -6.8], [2.4, 3.8, -6.0], { color: '#aeb3b9' });
  addCylinder(outlined, [2.8, 3.8, -3.0], 0.08, 0.5, { color: '#aeb3b9' });
  addCylinder(outlined, [2.8, 4.08, -3.0], 0.15, 0.06, { color: '#9aa1a8' }, { topRadius: 0.05 });
  addRod(outlined, [-4.6, 3.55, -7.5], [-4.6, 5.6, -7.5], 0.025, { color: COLORS.pole }, 6);
  addRod(outlined, [-4.9, 5.2, -7.5], [-4.3, 5.2, -7.5], 0.015, { color: COLORS.pole }, 4);
  addRod(outlined, [-4.8, 5.45, -7.5], [-4.4, 5.45, -7.5], 0.015, { color: COLORS.pole }, 4);
}
