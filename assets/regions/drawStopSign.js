/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_PLAIN } from '../core/constants.js';

/* drawStopSign（regions） */
export function drawStopSign(context, width, height) {
  context.clearRect(0, 0, width, height);
  const tracePath = (inset) => {
    context.beginPath();
    context.moveTo(14 + inset * 1.7, 26 + inset);
    context.lineTo(width - 14 - inset * 1.7, 26 + inset);
    context.lineTo(width / 2, height - 14 - inset * 2);
    context.closePath();
  };
  tracePath(0);
  context.fillStyle = '#ffffff';
  context.fill();
  tracePath(10);
  context.fillStyle = '#d7263d';
  context.fill();
  drawText(context, '止まれ', width / 2, height * 0.34, { color: '#ffffff', family: FONT_PLAIN, size: height * 0.19, weight: 900 });
  drawText(context, 'STOP', width / 2, height * 0.52, { color: '#ffffff', family: FONT_PLAIN, size: height * 0.09, weight: 800 });
}
