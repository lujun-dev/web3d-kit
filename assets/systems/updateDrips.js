/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { dripSources } from '../core/util.js';
import { triggerSplash } from './triggerSplash.js';

/* updateDrips（systems） */
export function updateDrips(time) {
  const gravity = 9.8;
  for (let index = 0; index < dripSources.length; index += 1) {
    const source = dripSources[index];
    const fallDuration = Math.sqrt((2 * (source.y - source.groundY)) / gravity);
    const hangDuration = Math.max(0.3, source.period - fallDuration);
    const cycleLength = hangDuration + fallDuration + 0.05;
    const localTime = (time + source.phase) % cycleLength;
    const cycle = Math.floor((time + source.phase) / cycleLength);
    const offset = index * 4;
    W.dripState.data[offset] = source.x;
    W.dripState.data[offset + 2] = source.z;
    if (localTime < hangDuration) {
      const growth = localTime / hangDuration;
      W.dripState.data[offset + 1] = source.y - 0.012 * growth;
      W.dripState.data[offset + 3] = 0.008 + 0.01 * growth;
      W.dripState.stretch[index] = 0.3 * growth;
      continue;
    }
    const fallTime = localTime - hangDuration;
    if (fallTime < fallDuration) {
      W.dripState.data[offset + 1] = source.y - 0.5 * gravity * fallTime * fallTime;
      W.dripState.data[offset + 3] = 0.014;
      W.dripState.stretch[index] = Math.min(6, gravity * fallTime * 0.4);
      continue;
    }
    W.dripState.data[offset + 3] = 0;
    if (source.lastSplashCycle !== cycle) {
      source.lastSplashCycle = cycle;
      triggerSplash(source.x, source.groundY + 0.01, source.z, time);
    }
  }
  W.dripState.attribute.needsUpdate = true;
  W.dripState.stretchAttribute.needsUpdate = true;
}
