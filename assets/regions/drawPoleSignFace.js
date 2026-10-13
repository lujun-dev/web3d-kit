/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_DISPLAY } from '../core/constants.js';
import { drawStar } from './drawStar.js';

/* drawPoleSignFace（regions） */
export function drawPoleSignFace(context, width, height) {
  context.fillStyle = BRAND.navy;
  context.fillRect(0, 0, width, height);
  fillRoundedRect(context, 16, 16, width - 32, height * 0.64, 20, BRAND.cream);
  context.fillStyle = BRAND.lemon;
  context.fillRect(16, height * 0.67, width - 32, 12);
  context.fillStyle = BRAND.sky;
  context.fillRect(16, height * 0.67 + 12, width - 32, height * 0.3 - 28);
  drawStar(context, width / 2, height * 0.27, height * 0.19, BRAND.lemon, BRAND.navy, 10);
  drawText(context, 'ほしぞら', width / 2, height * 0.55, { color: BRAND.navy, family: FONT_DISPLAY, size: height * 0.15, weight: 400 });
  drawText(context, 'MART', width / 2, height * 0.84, { color: '#ffffff', family: FONT_DISPLAY, size: height * 0.16, spacing: 10, weight: 400 });
}
