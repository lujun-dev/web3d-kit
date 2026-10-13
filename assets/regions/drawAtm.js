/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawAtm（regions） */
export function drawAtm(context, width, height) {
  context.fillStyle = '#d9dde2';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#1f9e89';
  context.fillRect(0, 0, width, height * 0.16);
  drawText(context, 'ATM', width / 2, height * 0.08, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.11, weight: 800 });
  context.fillStyle = '#4a8fd9';
  context.fillRect(width * 0.16, height * 0.22, width * 0.68, height * 0.26);
  drawText(context, 'お引き出し', width / 2, height * 0.35, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.06, weight: 800 });
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      fillRoundedRect(context, width * (0.3 + column * 0.14), height * (0.55 + row * 0.07), width * 0.1, height * 0.05, 3, '#f7f7f5');
    }
  }
  context.fillStyle = '#23272e';
  context.fillRect(width * 0.2, height * 0.8, width * 0.6, height * 0.05);
}
