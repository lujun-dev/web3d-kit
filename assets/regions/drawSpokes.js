/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';

/* drawSpokes（regions） */
export function drawSpokes(context, width, height) {
  context.clearRect(0, 0, width, height);
  const center = width / 2;
  context.strokeStyle = '#d6dbe1';
  context.lineWidth = 2;
  for (let spoke = 0; spoke < 32; spoke += 1) {
    const angle = (spoke / 32) * Math.PI * 2;
    const hubAngle = angle + (spoke % 2 === 0 ? 0.35 : -0.35);
    context.beginPath();
    context.moveTo(center + Math.cos(hubAngle) * 12, center + Math.sin(hubAngle) * 12);
    context.lineTo(center + Math.cos(angle) * width * 0.47, center + Math.sin(angle) * width * 0.47);
    context.stroke();
  }
  fillCircle(context, center, center, 14, '#b9bec5');
}
