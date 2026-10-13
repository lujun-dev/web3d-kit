/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* drawGloss（regions） */
export function drawGloss(context, x, y, width, height, alpha) {
  const gradient = context.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);
}
