/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle } from '../core/canvas.js';
import { BRAND, FONT_DISPLAY, FONT_ROUNDED } from '../core/constants.js';
import { drawStar } from './drawStar.js';

/* drawSignBand（regions） */
export function drawSignBand(context, width, height, isFront) {
  context.fillStyle = BRAND.cream;
  context.fillRect(0, 0, width, height);
  const stripeTop = height * 0.72;
  context.fillStyle = BRAND.sky;
  context.fillRect(0, stripeTop, width, height * 0.09);
  context.fillStyle = BRAND.lemon;
  context.fillRect(0, stripeTop + height * 0.09, width, height * 0.07);
  context.fillStyle = BRAND.navy;
  context.fillRect(0, stripeTop + height * 0.16, width, height * 0.07);
  const logoX = isFront ? height * 0.7 : width / 2 - height * 1.75;
  drawStar(context, logoX, height * 0.38, height * 0.3, BRAND.lemon, BRAND.navy, height * 0.035);
  drawText(context, 'ほしぞらマート', logoX + height * 0.45, height * 0.37, { align: 'left', color: BRAND.navy, family: FONT_DISPLAY, size: height * 0.42, weight: 400 });
  drawText(context, 'HOSHIZORA MART', logoX + height * 0.48, height * 0.63, { align: 'left', color: BRAND.sky, family: FONT_ROUNDED, size: height * 0.13, spacing: height * 0.035, weight: 800 });
  if (isFront) {
    const moonX = width * 0.63;
    const moonY = height * 0.36;
    fillCircle(context, moonX, moonY, height * 0.17, BRAND.lemon);
    fillCircle(context, moonX + height * 0.08, moonY - height * 0.05, height * 0.15, BRAND.cream);
    drawStar(context, moonX + height * 0.36, moonY - height * 0.12, height * 0.07, BRAND.sky);
    drawStar(context, moonX + height * 0.58, moonY + height * 0.08, height * 0.05, BRAND.lemon, BRAND.navy, 3);
    drawText(context, 'OPEN 24 HOURS', width - height * 0.35, height * 0.38, { align: 'right', color: BRAND.navy, family: FONT_ROUNDED, size: height * 0.2, spacing: 3, weight: 800 });
  }
}
