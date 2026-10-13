/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle } from '../core/canvas.js';
import { FONT_ROUNDED, MAGAZINE_TITLES, PACKAGE_PALETTE } from '../core/constants.js';
import { pickRandom, randomBetween } from '../core/math.js';
import { drawStar } from './drawStar.js';

/* drawMagazineSheet（regions） */
export function drawMagazineSheet(context, width, height) {
  const columns = 8;
  const rows = 4;
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const base = pickRandom(PACKAGE_PALETTE);
      const accent = pickRandom(['#ffffff', '#1f2d5c', '#ffd449', '#e84a3c']);
      context.save();
      context.translate(column * cellWidth, row * cellHeight);
      context.beginPath();
      context.rect(0, 0, cellWidth, cellHeight);
      context.clip();
      context.fillStyle = base;
      context.fillRect(0, 0, cellWidth, cellHeight);
      fillCircle(context, cellWidth * randomBetween(0.35, 0.65), cellHeight * 0.6, cellWidth * randomBetween(0.22, 0.34), 'rgba(255, 255, 255, 0.55)');
      drawStar(context, cellWidth * randomBetween(0.3, 0.7), cellHeight * randomBetween(0.5, 0.75), cellWidth * 0.12, accent);
      context.fillStyle = accent;
      context.fillRect(0, 0, cellWidth, cellHeight * 0.22);
      drawText(context, pickRandom(MAGAZINE_TITLES), cellWidth / 2, cellHeight * 0.11, { color: accent === '#ffffff' ? '#1f2d5c' : '#ffffff', family: FONT_ROUNDED, maxWidth: cellWidth * 0.9, size: cellHeight * 0.15, weight: 800 });
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let line = 0; line < 3; line += 1) {
        context.fillRect(cellWidth * 0.08, cellHeight * (0.8 + line * 0.055), cellWidth * randomBetween(0.3, 0.8), cellHeight * 0.025);
      }
      context.restore();
    }
  }
}
