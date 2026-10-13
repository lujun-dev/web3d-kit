/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawPoleGuard（regions） */
export function drawPoleGuard(context, width, height) {
  context.fillStyle = '#f2c230';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#1b1d22';
  for (let offset = -width; offset < height + width; offset += 44) {
    context.beginPath();
    context.moveTo(0, offset);
    context.lineTo(width, offset - width * 0.6);
    context.lineTo(width, offset - width * 0.6 + 22);
    context.lineTo(0, offset + 22);
    context.closePath();
    context.fill();
  }
}
