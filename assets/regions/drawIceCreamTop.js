/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle, fillRoundedRect } from '../core/canvas.js';
import { pickRandom, random, randomBetween } from '../core/math.js';

/* drawIceCreamTop（regions） */
export function drawIceCreamTop(context, width, height) {
  context.fillStyle = '#eef6fb';
  context.fillRect(0, 0, width, height);
  for (let item = 0; item < 26; item += 1) {
    const x = randomBetween(6, width - 30);
    const y = randomBetween(6, height - 26);
    const kind = Math.floor(random() * 3);
    const color = pickRandom(['#f7c6d0', '#ffe28a', '#9fd3ff', '#b5e48c', '#6d4c41', '#ffffff', '#ff9f7a']);
    if (kind === 0) {
      fillRoundedRect(context, x, y, 22, 36, 8, color);
      context.fillStyle = '#d8b27a';
      context.fillRect(x + 9, y + 32, 4, 10);
    } else if (kind === 1) {
      fillCircle(context, x + 14, y + 14, 14, color);
      fillCircle(context, x + 14, y + 14, 9, 'rgba(255, 255, 255, 0.5)');
    } else {
      fillRoundedRect(context, x, y, 36, 22, 4, color);
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.fillRect(x + 4, y + 8, 28, 5);
    }
  }
}
