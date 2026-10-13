/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_DISPLAY, FONT_ROUNDED } from '../core/constants.js';

/* drawPlaque（regions） */
export function drawPlaque(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#f1d58d');
  gradient.addColorStop(0.5, '#c79a4a');
  gradient.addColorStop(1, '#8e6a2c');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = 'rgba(90, 60, 20, 0.7)';
  context.lineWidth = 3;
  context.strokeRect(6, 6, width - 12, height - 12);
  drawText(context, '雨宿りの街角', width / 2, height * 0.4, { color: '#4a3210', family: FONT_DISPLAY, size: height * 0.34, spacing: 10, weight: 400 });
  drawText(context, 'RAINY NIGHT KONBINI · 1:150', width / 2, height * 0.76, { color: '#5b3f16', family: FONT_ROUNDED, size: height * 0.15, spacing: 5, weight: 800 });
}
