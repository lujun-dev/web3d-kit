/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, COLORS, LOT_Y } from '../core/constants.js';
import { addBlock, addCylinder, addTube } from '../core/geometry.js';

/* buildStreetLamp（props） */
export function buildStreetLamp() {
  const outlined = W.buckets.outlined;
  const x = -5.0;
  const z = 11.2;
  addCylinder(outlined, [x, LOT_Y + 0.1, z], 0.14, 0.2, { color: COLORS.concrete }, { segments: 12 });
  addCylinder(outlined, [x, LOT_Y + 3.2, z], 0.085, 6.1, { color: COLORS.pole }, { segments: 12, topRadius: 0.065 });
  addTube(outlined, [[x, 6.2, z], [x, 6.5, z - 0.3], [x, 6.6, z - 0.9], [x, 6.52, z - 1.5]], 0.05, { color: COLORS.pole }, 16, 8);
  addBlock(outlined, [x - 0.14, 6.36, z - 1.95], [x + 0.14, 6.5, z - 1.35], { color: '#9aa1ab' });
  addBlock(outlined, [x - 0.11, 6.33, z - 1.9], [x + 0.11, 6.36, z - 1.4], { channel: CHANNEL.steady, color: '#eaf6ff', emissive: 5.5 });
}
