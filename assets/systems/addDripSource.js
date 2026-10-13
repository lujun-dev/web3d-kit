/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { random, randomBetween } from '../core/math.js';
import { dripSources } from '../core/util.js';

/* addDripSource（systems） */
export function addDripSource(x, y, z, groundY) {
  dripSources.push({ groundY, lastSplashCycle: -1, period: randomBetween(1.3, 3.2), phase: random() * 10, x, y, z });
}
