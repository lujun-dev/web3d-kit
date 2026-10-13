/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawBasketGrid（regions） */
export function drawBasketGrid(context, width, height) {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = '#cfd4da';
  context.lineWidth = 3;
  for (let x = 2; x < width; x += 12) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 2; y < height; y += 12) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.lineWidth = 6;
  context.strokeRect(3, 3, width - 6, height - 6);
}
