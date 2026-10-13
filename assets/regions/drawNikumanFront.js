/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillEllipse } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';

/* drawNikumanFront（regions） */
export function drawNikumanFront(context, width, height) {
  context.fillStyle = '#d0d5db';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#d62828';
  context.fillRect(0, 0, width, height * 0.22);
  drawText(context, '中華まん', width / 2, height * 0.11, { color: '#ffffff', family: FONT_ROUNDED, size: height * 0.15, weight: 800 });
  const glass = context.createLinearGradient(0, height * 0.22, 0, height);
  glass.addColorStop(0, '#fff8ec');
  glass.addColorStop(1, '#f2e2c8');
  context.fillStyle = glass;
  context.fillRect(8, height * 0.26, width - 16, height * 0.68);
  for (let row = 0; row < 2; row += 1) {
    for (let bun = 0; bun < 5; bun += 1) {
      fillEllipse(context, 30 + bun * 48, height * (0.5 + row * 0.28), 19, 14, 0, row === 0 ? '#ffffff' : '#f7e4c9');
    }
  }
  context.fillStyle = 'rgba(255, 255, 255, 0.4)';
  context.fillRect(8, height * 0.26, width - 16, height * 0.1);
}
