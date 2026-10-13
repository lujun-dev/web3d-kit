/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';
import { BRAND } from '../core/constants.js';

/* drawClock（regions） */
export function drawClock(context, width, height) {
  context.fillStyle = BRAND.navy;
  context.fillRect(0, 0, width, height);
  fillCircle(context, width / 2, height / 2, width * 0.44, '#ffffff');
  context.strokeStyle = '#1b1d22';
  for (let tick = 0; tick < 12; tick += 1) {
    const angle = (tick / 12) * Math.PI * 2;
    context.lineWidth = tick % 3 === 0 ? 5 : 2;
    context.beginPath();
    context.moveTo(width / 2 + Math.cos(angle) * width * 0.34, height / 2 + Math.sin(angle) * width * 0.34);
    context.lineTo(width / 2 + Math.cos(angle) * width * 0.4, height / 2 + Math.sin(angle) * width * 0.4);
    context.stroke();
  }
  context.lineCap = 'round';
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(width / 2, height / 2);
  context.lineTo(width / 2 + Math.cos(-Math.PI / 2 + 0.6) * width * 0.2, height / 2 + Math.sin(-Math.PI / 2 + 0.6) * width * 0.2);
  context.stroke();
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(width / 2, height / 2);
  context.lineTo(width / 2 + Math.cos(-Math.PI / 2 + 1.78) * width * 0.32, height / 2 + Math.sin(-Math.PI / 2 + 1.78) * width * 0.32);
  context.stroke();
  context.lineCap = 'butt';
}
