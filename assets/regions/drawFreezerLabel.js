/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { BRAND, FONT_DISPLAY, FONT_ROUNDED } from '../core/constants.js';

/* drawFreezerLabel（regions） */
export function drawFreezerLabel(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#3f8fe0');
  gradient.addColorStop(1, '#7cc4f2');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  drawText(context, 'アイスクリーム', width * 0.42, height * 0.52, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.44, weight: 800 });
  drawText(context, 'ICE', width * 0.88, height * 0.52, { color: BRAND.lemon, family: FONT_DISPLAY, size: height * 0.5, weight: 400 });
}
