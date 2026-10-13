/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { random } from '../core/math.js';

/* drawPriceStrip（regions） */
export function drawPriceStrip(context, width, height) {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  for (let x = 6; x < width; x += 42) {
    context.fillStyle = random() < 0.2 ? '#ffd449' : '#fdf6e3';
    context.fillRect(x, 3, 30, height - 6);
    context.fillStyle = '#d62828';
    context.fillRect(x + 6, height * 0.4, 18, 3);
  }
}
