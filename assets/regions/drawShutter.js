/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawVerticalText } from '../core/canvas.js';
import { FONT_HAND } from '../core/constants.js';

/* drawShutter（regions） */
export function drawShutter(context, width, height) {
  context.fillStyle = '#9ea4ab';
  context.fillRect(0, 0, width, height);
  for (let y = 0; y < height; y += 9) {
    context.fillStyle = 'rgba(255, 255, 255, 0.22)';
    context.fillRect(0, y, width, 2);
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, y + 6, width, 3);
  }
  const dirt = context.createLinearGradient(0, height * 0.6, 0, height);
  dirt.addColorStop(0, 'rgba(60, 55, 50, 0)');
  dirt.addColorStop(1, 'rgba(60, 55, 50, 0.35)');
  context.fillStyle = dirt;
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#6d737a';
  context.fillRect(0, height - 12, width, 12);
  context.save();
  context.translate(width * 0.7, height * 0.42);
  context.rotate(0.04);
  context.fillStyle = '#fbfaf5';
  context.fillRect(-26, -34, 52, 68);
  drawVerticalText(context, '本日休業', 0, -24, 15, { color: '#222222', family: FONT_HAND, weight: 400 });
  context.restore();
}
