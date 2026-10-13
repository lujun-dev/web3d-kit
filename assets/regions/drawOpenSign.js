/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawOpenSign（regions） */
export function drawOpenSign(context, width, height) {
  fillRoundedRect(context, 0, 0, width, height, 16, '#101522');
  context.shadowColor = '#ff6fb5';
  context.shadowBlur = 14;
  drawText(context, 'OPEN', width * 0.36, height * 0.52, { color: '#ffd1ea', family: FONT_ROUNDED, size: height * 0.5, weight: 800 });
  context.shadowColor = '#5fd4ff';
  drawText(context, '24H', width * 0.78, height * 0.52, { color: '#d8f6ff', family: FONT_ROUNDED, size: height * 0.5, weight: 800 });
  context.shadowBlur = 0;
}
