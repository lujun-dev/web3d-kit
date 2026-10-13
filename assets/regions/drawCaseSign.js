/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawCaseSign（regions） */
export function drawCaseSign(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#f08a3c');
  gradient.addColorStop(1, '#f6b04f');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  drawText(context, 'お弁当・おにぎり・サンドイッチ', width / 2, height * 0.54, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.92, size: height * 0.5, weight: 800 });
}
