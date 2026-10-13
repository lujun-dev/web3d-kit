/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawAddressPlate（regions） */
export function drawAddressPlate(context, width, height) {
  context.fillStyle = '#1f5aa8';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#ffffff';
  context.lineWidth = 3;
  context.strokeRect(5, 5, width - 10, height - 10);
  drawText(context, '星見町 2-14', width / 2, height * 0.54, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.42, weight: 800 });
}
