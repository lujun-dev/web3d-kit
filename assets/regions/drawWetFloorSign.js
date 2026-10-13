/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawWetFloorSign（regions） */
export function drawWetFloorSign(context, width, height) {
  context.fillStyle = '#ffd21f';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#1b1d22';
  context.lineWidth = 6;
  context.strokeRect(6, 6, width - 12, height - 12);
  context.beginPath();
  context.moveTo(width / 2, height * 0.12);
  context.lineTo(width * 0.84, height * 0.5);
  context.lineTo(width * 0.16, height * 0.5);
  context.closePath();
  context.stroke();
  drawText(context, '！', width / 2, height * 0.37, { color: '#1b1d22', size: height * 0.2, weight: 900 });
  drawText(context, '足元注意', width / 2, height * 0.66, { color: '#1b1d22', family: FONT_ROUNDED, size: height * 0.15, weight: 800 });
  drawText(context, 'すべりやすい', width / 2, height * 0.82, { color: '#1b1d22', family: FONT_ROUNDED, maxWidth: width * 0.84, size: height * 0.1, weight: 800 });
}
