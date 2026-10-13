/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawStreetName（regions） */
export function drawStreetName(context, width, height) {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#2361c4';
  context.fillRect(5, 5, width - 10, height - 10);
  drawText(context, '星見通り', width / 2, height * 0.42, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.44, spacing: 6, weight: 800 });
  drawText(context, 'Hoshimi-dori', width / 2, height * 0.8, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.2, weight: 800 });
}
