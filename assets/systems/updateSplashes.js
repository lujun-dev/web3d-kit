/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { SPLASH_COUNT, SPLASH_LIFE } from '../core/constants.js';
import { random } from '../core/math.js';
import { respawnSplash } from './respawnSplash.js';

/* updateSplashes（systems） */
export function updateSplashes(time) {
  const data = W.splashState.data;
  for (let index = 0; index < SPLASH_COUNT; index += 1) {
    const offset = index * 4;
    if (time - data[offset + 3] > SPLASH_LIFE) {
      respawnSplash(offset, time + random() * 0.5);
    }
  }
  W.splashState.attribute.needsUpdate = true;
}
