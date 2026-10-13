/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';

/* drawStaffSign（regions） */
export function drawStaffSign(context, width, height) {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  drawText(context, 'STAFF ONLY', width / 2, height * 0.38, { color: BRAND.navy, family: FONT_ROUNDED, size: height * 0.4, spacing: 3, weight: 800 });
  drawText(context, '関係者以外立入禁止', width / 2, height * 0.78, { color: '#d62828', family: FONT_ROUNDED, size: height * 0.2, weight: 800 });
}
