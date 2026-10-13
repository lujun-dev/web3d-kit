/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';

/* drawSticker（regions） */
export function drawSticker(context, width, height, text, background, color, family) {
  fillRoundedRect(context, 0, 0, width, height, height * 0.25, background);
  drawText(context, text, width / 2, height * 0.54, { color, family, maxWidth: width * 0.88, size: height * 0.46, weight: 800 });
}
