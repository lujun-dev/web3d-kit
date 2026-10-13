/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { traceStar } from '../core/canvas.js';

/* drawStar（regions） */
export function drawStar(context, centerX, centerY, outerRadius, fillColor, strokeColor, strokeWidth) {
  traceStar(context, centerX, centerY, outerRadius, outerRadius * 0.45);
  context.fillStyle = fillColor;
  context.fill();
  if (strokeColor) {
    context.lineJoin = 'round';
    context.lineWidth = strokeWidth;
    context.strokeStyle = strokeColor;
    context.stroke();
  }
}
