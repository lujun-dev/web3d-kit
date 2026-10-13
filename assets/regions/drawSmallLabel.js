/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawSmallLabel（regions） */
export function drawSmallLabel(context, width, height, text, background, color) {
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  drawText(context, text, width / 2, height * 0.54, { color, family: FONT_ROUNDED, maxWidth: width * 0.9, size: height * 0.56, weight: 800 });
}
