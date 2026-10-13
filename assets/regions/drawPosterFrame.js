/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillRoundedRect } from '../core/canvas.js';

/* drawPosterFrame（regions） */
export function drawPosterFrame(context, width, height, outer, inner) {
  context.fillStyle = outer;
  context.fillRect(0, 0, width, height);
  fillRoundedRect(context, 10, 10, width - 20, height - 20, 12, inner);
}
