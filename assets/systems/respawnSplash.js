/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { SPLASH_SURFACES } from '../core/constants.js';
import { random, randomBetween } from '../core/math.js';

/* respawnSplash（systems） */
export function respawnSplash(offset, startTime) {
  const pick = random() * W.splashState.totalWeight;
  let surface = SPLASH_SURFACES[0];
  for (let index = 0; index < SPLASH_SURFACES.length; index += 1) {
    if (pick <= W.splashState.cumulativeWeights[index]) {
      surface = SPLASH_SURFACES[index];
      break;
    }
  }
  W.splashState.data[offset] = randomBetween(surface.minX, surface.maxX);
  W.splashState.data[offset + 1] = surface.y + 0.01;
  W.splashState.data[offset + 2] = randomBetween(surface.minZ, surface.maxZ);
  W.splashState.data[offset + 3] = startTime;
}
