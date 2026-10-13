/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { BOTTLE_KINDS } from '../core/constants.js';
import { pickRandom, randomBetween } from '../core/math.js';
import { drawDrink } from './drawDrink.js';

/* drawBottleStrips（regions） */
export function drawBottleStrips(context, width, height) {
  const rowHeight = height / BOTTLE_KINDS.length;
  for (let row = 0; row < BOTTLE_KINDS.length; row += 1) {
    const kind = BOTTLE_KINDS[row];
    const count = kind.isCan ? 9 : 7;
    const slotWidth = width / count;
    for (let index = 0; index < count; index += 1) {
      const heightScale = kind.isCan ? randomBetween(0.62, 0.72) : randomBetween(0.86, 0.98);
      drawDrink(context, slotWidth * (index + 0.5), (row + 1) * rowHeight - 2, slotWidth * 0.92, rowHeight * heightScale, pickRandom(kind.colors), kind.isCan);
    }
  }
}
