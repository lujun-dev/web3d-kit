/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawSignBack（regions） */
export function drawSignBack(context, width, height) {
  context.clearRect(0, 0, width, height);
  context.beginPath();
  context.moveTo(14, 26);
  context.lineTo(width - 14, 26);
  context.lineTo(width / 2, height - 14);
  context.closePath();
  context.fillStyle = '#9aa1a8';
  context.fill();
}
