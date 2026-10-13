/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillEllipse } from '../core/canvas.js';
import { random, randomBetween } from '../core/math.js';
import { sprinkle } from '../core/util.js';

/* drawRoofSurface（regions） */
export function drawRoofSurface(context, width, height) {
  context.fillStyle = '#56605e';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = 'rgba(30, 36, 36, 0.4)';
  context.lineWidth = 2;
  for (let x = 0; x < width; x += 64) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let puddle = 0; puddle < 7; puddle += 1) {
    fillEllipse(context, random() * width, random() * height, randomBetween(20, 60), randomBetween(10, 30), random() * 3, 'rgba(24, 32, 40, 0.55)');
  }
  sprinkle(context, width, height, 900, ['rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.08)'], 1, 3);
}
