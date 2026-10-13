/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';
import { pickRandom } from '../core/math.js';

/* drawCigaretteShelf（regions） */
export function drawCigaretteShelf(context, width, height) {
  context.fillStyle = '#23272e';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#f6f2e8';
  context.fillRect(0, 0, width, height * 0.1);
  drawText(context, 'TOBACCO', width / 2, height * 0.05, { color: BRAND.navy, family: FONT_ROUNDED, size: height * 0.07, spacing: 8, weight: 800 });
  const columns = 12;
  const rows = 7;
  const cellWidth = width / columns;
  const cellHeight = (height * 0.9) / rows;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = column * cellWidth;
      const y = height * 0.1 + row * cellHeight;
      const color = pickRandom(['#f4efe3', '#1f2d5c', '#c0392b', '#2d3a4a', '#d4a82f', '#6c8ebf', '#e8e2d0', '#3f7d4f']);
      context.fillStyle = color;
      context.fillRect(x + cellWidth * 0.14, y + cellHeight * 0.12, cellWidth * 0.72, cellHeight * 0.6);
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.fillRect(x + cellWidth * 0.14, y + cellHeight * 0.3, cellWidth * 0.72, cellHeight * 0.08);
      context.fillStyle = '#ffd449';
      context.fillRect(x + cellWidth * 0.2, y + cellHeight * 0.78, cellWidth * 0.6, cellHeight * 0.12);
    }
  }
}
