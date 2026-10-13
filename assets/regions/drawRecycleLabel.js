/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawRecycleLabel（regions） */
export function drawRecycleLabel(context, width, height) {
  context.fillStyle = '#2361c4';
  context.fillRect(0, 0, width, height);
  drawText(context, 'あきかん', width * 0.5, height * 0.2, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.16, weight: 800 });
  drawText(context, 'ペットボトル', width * 0.5, height * 0.38, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.9, size: height * 0.14, weight: 800 });
  fillCircle(context, width * 0.3, height * 0.7, height * 0.13, '#101216');
  fillCircle(context, width * 0.7, height * 0.7, height * 0.13, '#101216');
}
