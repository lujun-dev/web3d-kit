/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';

/* drawWalkSignal（regions） */
export function drawWalkSignal(context, width, height, isGreen) {
  context.fillStyle = '#15171b';
  context.fillRect(0, 0, width, height);
  const color = isGreen ? '#35f0b8' : '#ff4a3d';
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineCap = 'round';
  context.lineWidth = width * 0.1;
  fillCircle(context, width * 0.5, height * 0.2, width * 0.1, color);
  context.beginPath();
  if (isGreen) {
    context.moveTo(width * 0.5, height * 0.34);
    context.lineTo(width * 0.46, height * 0.58);
    context.lineTo(width * 0.34, height * 0.82);
    context.moveTo(width * 0.46, height * 0.58);
    context.lineTo(width * 0.64, height * 0.8);
    context.moveTo(width * 0.49, height * 0.4);
    context.lineTo(width * 0.32, height * 0.5);
    context.moveTo(width * 0.49, height * 0.4);
    context.lineTo(width * 0.68, height * 0.48);
  } else {
    context.moveTo(width * 0.5, height * 0.34);
    context.lineTo(width * 0.5, height * 0.62);
    context.moveTo(width * 0.44, height * 0.62);
    context.lineTo(width * 0.42, height * 0.86);
    context.moveTo(width * 0.56, height * 0.62);
    context.lineTo(width * 0.58, height * 0.86);
    context.moveTo(width * 0.5, height * 0.38);
    context.lineTo(width * 0.34, height * 0.58);
    context.moveTo(width * 0.5, height * 0.38);
    context.lineTo(width * 0.66, height * 0.58);
  }
  context.stroke();
  context.lineCap = 'butt';
}
