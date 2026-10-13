/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillEllipse } from '../core/canvas.js';
import { pickRandom, random, randomBetween } from '../core/math.js';
import { sprinkle } from '../core/util.js';

/* drawStrata（regions） */
export function drawStrata(context, width, height) {
  context.fillStyle = '#6a5641';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#2f3238';
  context.fillRect(0, 0, width, height * 0.12);
  context.fillStyle = '#76797f';
  context.fillRect(0, height * 0.12, width, height * 0.24);
  sprinkle(context, width, height * 0.36, 700, ['#5d6066', '#8d9096', '#4d5056'], 2, 5);
  for (let pebble = 0; pebble < 90; pebble += 1) {
    fillEllipse(context, random() * width, height * randomBetween(0.42, 0.98), randomBetween(2, 6), randomBetween(2, 4), random() * 3, pickRandom(['#8a7358', '#54432f', '#9b8a72']));
  }
  context.fillStyle = 'rgba(0, 0, 0, 0.18)';
  context.fillRect(0, height * 0.36, width, 3);
}
