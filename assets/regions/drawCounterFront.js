/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';
import { drawStar } from './drawStar.js';

/* drawCounterFront（regions） */
export function drawCounterFront(context, width, height) {
  context.fillStyle = BRAND.cream;
  context.fillRect(0, 0, width, height);
  context.fillStyle = BRAND.sky;
  context.fillRect(0, height * 0.7, width, height * 0.12);
  context.fillStyle = BRAND.lemon;
  context.fillRect(0, height * 0.82, width, height * 0.08);
  context.fillStyle = BRAND.navy;
  context.fillRect(0, height * 0.9, width, height * 0.1);
  drawStar(context, width * 0.12, height * 0.36, height * 0.2, BRAND.lemon, BRAND.navy, 4);
  drawText(context, 'いらっしゃいませ', width * 0.56, height * 0.36, { color: BRAND.navy, family: FONT_ROUNDED, size: height * 0.26, weight: 800 });
}
