/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';
import { pickRandom, random, randomBetween } from '../core/math.js';

/* drawHotSnackTray（regions） */
export function drawHotSnackTray(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#ffe3a6');
  gradient.addColorStop(1, '#e8a54a');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  for (let piece = 0; piece < 14; piece += 1) {
    const x = randomBetween(10, width * 0.55);
    const y = randomBetween(height * 0.2, height * 0.9);
    fillEllipse(context, x, y, randomBetween(12, 17), randomBetween(9, 13), random() * 3, pickRandom(['#b8652a', '#c97a34', '#a8561f']));
    fillCircle(context, x - 3, y - 3, 3, 'rgba(255, 220, 150, 0.8)');
  }
  for (let piece = 0; piece < 5; piece += 1) {
    fillEllipse(context, width * 0.68 + (piece % 2) * 30, height * (0.3 + piece * 0.13), 20, 12, 0, '#d9a441');
  }
  for (let piece = 0; piece < 3; piece += 1) {
    fillRoundedRect(context, width * 0.84, height * (0.25 + piece * 0.22), 34, 12, 6, '#a8452c');
  }
  drawText(context, 'からあげ', width * 0.28, height * 0.1, { color: '#7a2e12', family: FONT_ROUNDED, size: height * 0.11, weight: 800 });
  drawText(context, 'コロッケ', width * 0.75, height * 0.1, { color: '#7a2e12', family: FONT_ROUNDED, size: height * 0.11, weight: 800 });
}
