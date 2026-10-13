/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { randomBetween } from '../core/math.js';
import { addDripSource } from './addDripSource.js';

/* registerDripSources（systems） */
export function registerDripSources() {
  for (let x = -5.1; x < 3.85; x += randomBetween(0.28, 0.45)) {
    addDripSource(x, 2.92, 0.46, LOT_Y);
  }
  for (const z of [-4.45, -5.0, -5.55, -6.1]) {
    addDripSource(4.64, 1.86, z, LOT_Y);
  }
  for (let z = -11.2; z < -2.4; z += randomBetween(0.8, 1.3)) {
    addDripSource(-7.02, 5.92, z, LOT_Y);
  }
  for (let x = -11.4; x < -7.9; x += randomBetween(0.5, 0.8)) {
    addDripSource(x, 2.87, -1.66, LOT_Y);
  }
  addDripSource(-4.184, 5.13, 2.684, LOT_Y);
  addDripSource(-5.316, 5.13, 3.816, LOT_Y);
  addDripSource(-5.0, 6.32, 9.3, 0);
  addDripSource(8.52, 5.3, -10.5, 0);
  addDripSource(9.28, 5.3, -10.5, 0);
  addDripSource(2.45, 2.34, -8.5, LOT_Y);
  addDripSource(3.3, 2.34, -8.5, LOT_Y);
  addDripSource(-10.4, 2.08, 3.66, LOT_Y);
  addDripSource(-8.8, 2.08, 3.66, LOT_Y);
}
