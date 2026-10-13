/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import { addPanel } from '../core/geometry.js';

/* buildWallPosters（props） */
export function buildWallPosters() {
  for (let index = 0; index < 3; index += 1) {
    addPanel(W.buckets.outlined, [-4.99, 2.62, -6.2 + index * 1.25], 0.42, 0.58, '+x', { map: getSubRect(W.atlasRects.wallPosters, index, 0, 3, 1) });
  }
}
