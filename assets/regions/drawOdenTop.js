/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';

/* drawOdenTop（regions） */
export function drawOdenTop(context, width, height) {
  context.fillStyle = '#c8cdd3';
  context.fillRect(0, 0, width, height);
  const columns = 4;
  const rows = 2;
  const cellWidth = (width - 12) / columns;
  const cellHeight = (height - 12) / rows;
  const items = [
    (x, y) => {
      fillCircle(context, x, y, 14, '#f1e0b8');
      fillCircle(context, x + 18, y + 10, 12, '#ecd6a6');
    },
    (x, y) => {
      fillEllipse(context, x, y, 13, 10, 0, '#f7ecd9');
      fillEllipse(context, x + 16, y + 12, 13, 10, 0.4, '#e8cfa1');
    },
    (x, y) => {
      context.fillStyle = '#7d7874';
      context.beginPath();
      context.moveTo(x - 14, y + 12);
      context.lineTo(x + 14, y + 12);
      context.lineTo(x, y - 14);
      context.closePath();
      context.fill();
      fillCircle(context, x + 20, y - 6, 9, '#6e6964');
    },
    (x, y) => {
      fillRoundedRect(context, x - 20, y - 7, 40, 14, 7, '#d7a45a');
      fillCircle(context, x - 20, y, 5, '#8a5a2b');
      fillRoundedRect(context, x - 14, y + 10, 34, 12, 6, '#e0b36a');
    },
  ];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = 6 + column * cellWidth;
      const y = 6 + row * cellHeight;
      context.fillStyle = '#b87d3c';
      context.fillRect(x + 3, y + 3, cellWidth - 6, cellHeight - 6);
      items[(row * columns + column) % items.length](x + cellWidth * 0.42, y + cellHeight * 0.45);
    }
  }
  context.fillStyle = 'rgba(255, 240, 210, 0.25)';
  context.fillRect(0, 0, width, height);
}
