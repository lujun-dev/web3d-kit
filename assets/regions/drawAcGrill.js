/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawAcGrill（regions） */
export function drawAcGrill(context, width, height) {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = '#d7d9dc';
  context.lineWidth = 3;
  for (let ring = 1; ring <= 5; ring += 1) {
    context.beginPath();
    context.arc(width / 2, height / 2, (ring / 5) * width * 0.47, 0, Math.PI * 2);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(width * 0.03, height / 2);
  context.lineTo(width * 0.97, height / 2);
  context.moveTo(width / 2, height * 0.03);
  context.lineTo(width / 2, height * 0.97);
  context.stroke();
}
