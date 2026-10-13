/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { SPLASH_COUNT, SPLASH_EXTRA } from '../core/constants.js';

/* triggerSplash（systems） */
export function triggerSplash(x, y, z, time) {
  const offset = (SPLASH_COUNT + W.splashState.nextExtraSlot) * 4;
  W.splashState.nextExtraSlot = (W.splashState.nextExtraSlot + 1) % SPLASH_EXTRA;
  W.splashState.data[offset] = x;
  W.splashState.data[offset + 1] = y;
  W.splashState.data[offset + 2] = z;
  W.splashState.data[offset + 3] = time;
}
