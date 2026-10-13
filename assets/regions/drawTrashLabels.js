/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawTrashLabels（regions） */
export function drawTrashLabels(context, width, height) {
  const labels = [
    { color: '#d62828', text: 'もえるゴミ' },
    { color: '#2361c4', text: 'かん・びん' },
    { color: '#2f7d4f', text: 'ペットボトル' },
  ];
  const labelWidth = width / labels.length;
  labels.forEach((label, index) => {
    const x = index * labelWidth;
    context.fillStyle = '#e9e5dc';
    context.fillRect(x, 0, labelWidth, height);
    context.fillStyle = label.color;
    context.fillRect(x + 6, 6, labelWidth - 12, height * 0.36);
    drawText(context, label.text, x + labelWidth / 2, height * 0.24, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: labelWidth - 18, size: height * 0.2, weight: 800 });
    if (index === 0) {
      fillRoundedRect(context, x + labelWidth * 0.2, height * 0.56, labelWidth * 0.6, height * 0.26, 8, '#15171b');
    } else {
      fillCircle(context, x + labelWidth / 2, height * 0.69, height * 0.16, '#15171b');
    }
  });
}
