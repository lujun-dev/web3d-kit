/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';

/* drawMenuBoard（regions） */
export function drawMenuBoard(context, width, height) {
  context.fillStyle = '#1b2233';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = BRAND.lemon;
  context.lineWidth = 4;
  context.strokeRect(6, 6, width - 12, height - 12);
  fillRoundedRect(context, 26, height * 0.3, 70, 64, 12, '#ffffff');
  context.strokeStyle = '#ffffff';
  context.lineWidth = 6;
  context.beginPath();
  context.arc(104, height * 0.47, 14, -Math.PI / 2, Math.PI / 2);
  context.stroke();
  drawText(context, 'HOT COFFEE', 150, height * 0.26, { align: 'left', color: '#ffffff', family: FONT_ROUNDED, size: 30, weight: 800 });
  drawText(context, 'R 100円  L 150円', 150, height * 0.46, { align: 'left', color: BRAND.lemon, family: FONT_ROUNDED, size: 24, weight: 800 });
  drawText(context, 'ICED COFFEE  R 110円', 150, height * 0.66, { align: 'left', color: '#bfe3ff', family: FONT_ROUNDED, size: 22, weight: 800 });
  drawText(context, 'カフェラテ  180円', 150, height * 0.84, { align: 'left', color: '#ffd8b0', family: FONT_ROUNDED, size: 22, weight: 800 });
}
