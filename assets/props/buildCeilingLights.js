/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL } from '../core/constants.js';
import { addBlock } from '../core/geometry.js';

/* buildCeilingLights（props） */
export function buildCeilingLights() {
  for (const z of [-2.1, -3.7, -5.3, -6.9]) {
    addBlock(W.buckets.outlined, [-4.6, 2.96, z - 0.13], [3.2, 3.0, z + 0.13], { channel: CHANNEL.interiorLights, color: '#fffaf0', emissive: 2.4, interior: 0 });
  }
}
