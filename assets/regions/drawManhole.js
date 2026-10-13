/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCircle } from '../core/canvas.js';
import { GROUND_SCALE } from '../core/constants.js';
import { toGroundX, toGroundY } from '../core/util.js';
import { drawStar } from './drawStar.js';

/* drawManhole（regions） */
export function drawManhole(context, x, z) {
  const centerX = toGroundX(x);
  const centerY = toGroundY(z);
  const radius = 0.34 * GROUND_SCALE;
  fillCircle(context, centerX, centerY, radius, '#26292f');
  fillCircle(context, centerX, centerY, radius * 0.9, '#3d4149');
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius * 0.86, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = '#555a63';
  context.lineWidth = 2;
  for (let offset = -radius; offset < radius; offset += 7) {
    context.beginPath();
    context.moveTo(centerX + offset, centerY - radius);
    context.lineTo(centerX + offset + radius, centerY + radius);
    context.moveTo(centerX + offset, centerY + radius);
    context.lineTo(centerX + offset + radius, centerY - radius);
    context.stroke();
  }
  context.restore();
  fillCircle(context, centerX, centerY, radius * 0.28, '#4a4f58');
  drawStar(context, centerX, centerY, radius * 0.2, '#666c76');
}
