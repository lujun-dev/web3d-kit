/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { randomBetween } from '../core/math.js';
import { triggerSplash } from './triggerSplash.js';

/* updateOverflowStream（systems） */
export function updateOverflowStream(time) {
  if (time - W.overflowStream.lastSplash > 0.07) {
    W.overflowStream.lastSplash = time;
    triggerSplash(W.overflowStream.x + 0.03 + randomBetween(-0.03, 0.03), LOT_Y + 0.01, W.overflowStream.z + randomBetween(-0.03, 0.03), time);
  }
}
