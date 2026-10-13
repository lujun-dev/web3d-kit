/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, drawVerticalText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawPoleAd（regions） */
export function drawPoleAd(context, width, height, isDentist) {
  if (isDentist) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#2f6fd6';
    context.fillRect(0, 0, width, height * 0.1);
    drawVerticalText(context, 'ほしの歯科', width / 2, height * 0.2, width * 0.52, { color: '#1f2d5c', family: FONT_ROUNDED, weight: 800 });
    drawText(context, 'この先200m', width / 2, height * 0.9, { color: '#d62828', family: FONT_ROUNDED, maxWidth: width * 0.9, size: width * 0.17, weight: 800 });
    return;
  }
  context.fillStyle = '#2f7d4f';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#ffd449';
  context.fillRect(0, height * 0.9, width, height * 0.1);
  drawVerticalText(context, 'つきみ不動産', width / 2, height * 0.1, width * 0.46, { color: '#ffffff', family: FONT_ROUNDED, weight: 800 });
}
