/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { CATEGORY_SIGNS, FONT_ROUNDED } from '../core/constants.js';

/* drawCategorySigns（regions） */
export function drawCategorySigns(context, width, height) {
  const rowHeight = height / CATEGORY_SIGNS.length;
  CATEGORY_SIGNS.forEach((sign, index) => {
    const y = index * rowHeight;
    context.fillStyle = sign.color;
    context.fillRect(0, y, width, rowHeight);
    context.fillStyle = 'rgba(255, 255, 255, 0.25)';
    context.fillRect(0, y, width, rowHeight * 0.14);
    drawText(context, sign.text, width / 2, y + rowHeight * 0.55, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.9, size: rowHeight * 0.5, weight: 800 });
  });
}
