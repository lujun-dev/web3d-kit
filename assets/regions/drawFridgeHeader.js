/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';

/* drawFridgeHeader（regions） */
export function drawFridgeHeader(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#e6f5ff');
  gradient.addColorStop(1, '#b9e0fa');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = BRAND.sky;
  context.fillRect(0, height - 14, width, 14);
  drawText(context, 'つめた～いドリンク', width * 0.36, height * 0.46, { color: BRAND.navy, family: FONT_ROUNDED, size: height * 0.44, weight: 800 });
  drawText(context, 'COLD DRINKS', width * 0.82, height * 0.46, { color: BRAND.sky, family: FONT_ROUNDED, size: height * 0.28, spacing: 4, weight: 800 });
  for (const x of [0.05, 0.66, 0.97]) {
    drawText(context, '＊', width * x, height * 0.45, { color: '#ffffff', size: height * 0.5, stroke: BRAND.sky, strokeWidth: 4 });
  }
}
