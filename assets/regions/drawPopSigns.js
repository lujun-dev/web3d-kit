/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_HAND } from '../core/constants.js';

/* drawPopSigns（regions） */
export function drawPopSigns(context, width, height) {
  const pops = [
    { background: '#ffd449', color: '#d62828', text: '新商品!' },
    { background: '#e84a3c', color: '#ffffff', text: 'おすすめ' },
    { background: '#ffffff', color: '#2361c4', text: '期間限定' },
    { background: '#1f2d5c', color: '#ffd449', text: '今だけ' },
  ];
  const popWidth = width / pops.length;
  pops.forEach((pop, index) => {
    const x = index * popWidth;
    context.fillStyle = pop.background;
    context.fillRect(x, 0, popWidth, height);
    context.strokeStyle = pop.color;
    context.lineWidth = 3;
    context.setLineDash([6, 5]);
    context.strokeRect(x + 5, 5, popWidth - 10, height - 10);
    context.setLineDash([]);
    drawText(context, pop.text, x + popWidth / 2, height * 0.54, { color: pop.color, family: FONT_HAND, maxWidth: popWidth - 16, size: height * 0.5, weight: 400 });
  });
}
