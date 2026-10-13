/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_DISPLAY, FONT_ROUNDED } from '../core/constants.js';

/* drawPoleSignSub（regions） */
export function drawPoleSignSub(context, width, height) {
  context.fillStyle = BRAND.navy;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = BRAND.lemon;
  context.lineWidth = 6;
  context.strokeRect(8, 8, width - 16, height - 16);
  drawText(context, '24H', width * 0.3, height * 0.54, { color: BRAND.lemon, family: FONT_DISPLAY, size: height * 0.6, weight: 400 });
  fillRoundedRect(context, width * 0.58, height * 0.22, width * 0.2, height * 0.56, 10, '#ffffff');
  drawText(context, 'ATM', width * 0.68, height * 0.51, { color: BRAND.sky, family: FONT_ROUNDED, size: height * 0.26, weight: 800 });
  fillRoundedRect(context, width * 0.81, height * 0.22, width * 0.13, height * 0.56, 10, BRAND.sky);
  drawText(context, 'P', width * 0.875, height * 0.52, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.42, weight: 800 });
}
