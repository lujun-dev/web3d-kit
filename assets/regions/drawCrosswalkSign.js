/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';

/* drawCrosswalkSign（regions） */
export function drawCrosswalkSign(context, width, height) {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#2361c4';
  context.fillRect(8, 8, width - 16, height - 16);
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.moveTo(width / 2, height * 0.14);
  context.lineTo(width * 0.86, height * 0.84);
  context.lineTo(width * 0.14, height * 0.84);
  context.closePath();
  context.fill();
  context.fillStyle = '#1b1d22';
  for (let stripe = 0; stripe < 4; stripe += 1) {
    context.fillRect(width * (0.26 + stripe * 0.13), height * 0.74, width * 0.08, height * 0.06);
  }
  fillCircle(context, width * 0.52, height * 0.36, width * 0.045, '#1b1d22');
  context.strokeStyle = '#1b1d22';
  context.lineWidth = width * 0.045;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(width * 0.51, height * 0.42);
  context.lineTo(width * 0.48, height * 0.56);
  context.lineTo(width * 0.42, height * 0.68);
  context.moveTo(width * 0.48, height * 0.56);
  context.lineTo(width * 0.57, height * 0.67);
  context.moveTo(width * 0.5, height * 0.46);
  context.lineTo(width * 0.42, height * 0.52);
  context.moveTo(width * 0.5, height * 0.46);
  context.lineTo(width * 0.59, height * 0.5);
  context.stroke();
  context.lineCap = 'butt';
}
