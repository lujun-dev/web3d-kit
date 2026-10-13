/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';
import { pickRandom, random, randomBetween } from '../core/math.js';
import { drawGloss } from './drawGloss.js';

/* drawBentoSheet（regions） */
export function drawBentoSheet(context, width, height) {
  const cell = width / 8;
  const onigiriLabels = ['鮭', '梅', '昆布', 'ツナ', '明太', 'おかか', '鮭', 'ツナ'];
  const labelColors = ['#e8743b', '#d23a5f', '#3f7d4f', '#3a8fd9', '#e84a3c', '#8a6a2f', '#e8743b', '#3a8fd9'];
  for (let column = 0; column < 8; column += 1) {
    const x = column * cell;
    context.fillStyle = '#f7f4ec';
    context.fillRect(x, 0, cell, cell);
    for (let grain = 0; grain < 40; grain += 1) {
      fillEllipse(context, x + random() * cell, random() * cell * 0.6, 2.2, 1.2, random() * 3, 'rgba(210, 200, 180, 0.7)');
    }
    context.fillStyle = '#1f2a24';
    context.fillRect(x, cell * 0.6, cell, cell * 0.4);
    fillRoundedRect(context, x + cell * 0.25, cell * 0.2, cell * 0.5, cell * 0.24, 4, labelColors[column]);
    drawText(context, onigiriLabels[column], x + cell / 2, cell * 0.325, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: cell * 0.46, size: cell * 0.16, weight: 800 });
    drawGloss(context, x, 0, cell, cell, 0.45);
  }
  const fillings = [['#f5d24a', '#ffffff'], ['#f3a3a3', '#8cc152'], ['#e9b44c', '#8cc152'], ['#f08a5d', '#ffe8a3']];
  for (let column = 0; column < 8; column += 1) {
    const x = column * cell;
    const y = cell;
    const filling = fillings[column % fillings.length];
    context.fillStyle = '#e9d3a5';
    context.fillRect(x, y, cell, cell);
    context.fillStyle = '#fbf3e0';
    context.fillRect(x + 4, y + 4, cell - 8, cell - 8);
    context.fillStyle = filling[0];
    context.fillRect(x + 6, y + cell * 0.42, cell - 12, cell * 0.16);
    context.fillStyle = filling[1];
    context.fillRect(x + 6, y + cell * 0.58, cell - 12, cell * 0.08);
    drawGloss(context, x, y, cell, cell, 0.5);
  }
  const bentoFoods = ['#b8652a', '#8cc152', '#f5d24a', '#f3a3a3', '#e8743b', '#6d4c41'];
  for (let column = 0; column < 8; column += 1) {
    const x = column * cell;
    const y = cell * 2;
    context.fillStyle = '#1d1b1a';
    context.fillRect(x, y, cell, cell);
    context.fillStyle = '#f7f4ec';
    context.fillRect(x + 4, y + 4, cell * 0.46, cell - 8);
    fillCircle(context, x + cell * 0.27, y + cell * 0.5, cell * 0.07, '#c0392b');
    for (let item = 0; item < 5; item += 1) {
      fillCircle(context, x + cell * randomBetween(0.62, 0.9), y + cell * randomBetween(0.18, 0.82), cell * randomBetween(0.07, 0.12), pickRandom(bentoFoods));
    }
    drawGloss(context, x, y, cell, cell, 0.35);
  }
  for (let column = 0; column < 8; column += 1) {
    const x = column * cell;
    const y = cell * 3;
    if (column < 4) {
      fillCircle(context, x + cell / 2, y + cell / 2, cell * 0.48, '#f4efe3');
      fillCircle(context, x + cell / 2, y + cell / 2, cell * 0.4, pickRandom(['#b07a3a', '#e9c46a', '#c96f3b', '#f1e0b8']));
      fillEllipse(context, x + cell * 0.4, y + cell * 0.45, cell * 0.14, cell * 0.08, 0.3, '#f5d24a');
      fillCircle(context, x + cell * 0.62, y + cell * 0.56, cell * 0.08, '#8cc152');
    } else {
      context.fillStyle = '#ffffff';
      context.fillRect(x, y, cell, cell);
      fillCircle(context, x + cell / 2, y + cell / 2, cell * 0.42, pickRandom(['#f5d8a0', '#fff4f4', '#6d4c41', '#f7c6d0']));
      fillCircle(context, x + cell / 2, y + cell / 2, cell * 0.12, '#e84a3c');
    }
    drawGloss(context, x, y, cell, cell, 0.4);
  }
}
