/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_DISPLAY } from '../core/constants.js';
import { random } from '../core/math.js';

/* drawNeighborSign（regions） */
export function drawNeighborSign(context, width, height) {
  context.fillStyle = '#5c3f2b';
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let grain = 0; grain < 12; grain += 1) {
    context.fillRect(0, random() * height, width, 2);
  }
  drawText(context, 'ほしみ文具店', width / 2, height * 0.54, { color: '#f4e6c8', family: FONT_DISPLAY, size: height * 0.56, spacing: 8, weight: 400 });
}
