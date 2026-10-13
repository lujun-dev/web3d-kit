/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawRoofTiles（regions） */
export function drawRoofTiles(context, width, height) {
  context.fillStyle = '#343b4a';
  context.fillRect(0, 0, width, height);
  const courseWidth = width / 9;
  for (let course = 0; course < 9; course += 1) {
    const x = course * courseWidth;
    context.fillStyle = '#434b5c';
    context.fillRect(x, 0, courseWidth * 0.35, height);
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(x + courseWidth - 3, 0, 3, height);
    for (let y = 0; y < height; y += 28) {
      context.fillStyle = 'rgba(0, 0, 0, 0.18)';
      context.fillRect(x, y + (course % 2) * 14, courseWidth, 2);
    }
  }
}
