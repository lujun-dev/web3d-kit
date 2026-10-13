/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';

/* drawAcFace（regions） */
export function drawAcFace(context, width, height) {
  context.fillStyle = '#e8e8e3';
  context.fillRect(0, 0, width, height);
  fillCircle(context, width * 0.4, height * 0.5, height * 0.4, '#23262b');
  context.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let slot = 0; slot < 8; slot += 1) {
    context.fillRect(width * 0.83, height * (0.2 + slot * 0.08), width * 0.12, height * 0.03);
  }
  context.fillStyle = 'rgba(80, 90, 100, 0.25)';
  context.fillRect(0, height - 6, width, 6);
}
