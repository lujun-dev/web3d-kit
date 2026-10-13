/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawCopier（regions） */
export function drawCopier(context, width, height) {
  context.fillStyle = '#e6e8ea';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#2b2f36';
  context.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.28);
  context.fillStyle = '#9fd3ff';
  context.fillRect(width * 0.16, height * 0.15, width * 0.4, height * 0.18);
  drawText(context, 'コピー', width * 0.73, height * 0.24, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.1, weight: 800 });
  context.fillStyle = '#b9bec5';
  for (let tray = 0; tray < 3; tray += 1) {
    context.fillRect(width * 0.08, height * (0.5 + tray * 0.16), width * 0.84, height * 0.03);
  }
}
