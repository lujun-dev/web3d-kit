/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';

/* updateCat（systems） */
export function updateCat(time) {
  const sway = Math.sin(time * 1.3) * 0.22 + Math.sin(time * 3.7) * 0.05;
  const flickCycle = time % 6.5;
  const flick = flickCycle < 0.4 ? Math.sin((flickCycle / 0.4) * Math.PI) * 0.35 : 0;
  W.catTail.rotation.y = W.catTailBaseRotation + sway + flick;
}
