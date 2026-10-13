/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawCoffeeMachine（regions） */
export function drawCoffeeMachine(context, width, height) {
  context.fillStyle = '#2c3036';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#9fd3ff';
  context.fillRect(width * 0.16, height * 0.08, width * 0.68, height * 0.16);
  drawText(context, 'COFFEE', width / 2, height * 0.16, { color: '#1f2d5c', family: FONT_ROUNDED, size: height * 0.07, weight: 800 });
  const buttonColors = ['#e84a3c', '#f29e38', '#3ba6e6', '#63b75b'];
  buttonColors.forEach((color, index) => {
    fillRoundedRect(context, width * (0.14 + index * 0.19), height * 0.3, width * 0.15, height * 0.07, 4, color);
  });
  context.fillStyle = '#121418';
  context.fillRect(width * 0.2, height * 0.45, width * 0.6, height * 0.42);
  context.fillStyle = '#50565f';
  for (let bar = 0; bar < 5; bar += 1) {
    context.fillRect(width * 0.24, height * (0.82 - bar * 0.01), width * 0.52, 2);
  }
}
