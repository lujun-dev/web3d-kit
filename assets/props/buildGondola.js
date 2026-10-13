/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import { FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock } from '../core/geometry.js';
import { placeProducts } from '../core/util.js';

/* buildGondola（props） */
export function buildGondola(centerX, frontZ, backZ, leftCategory, rightCategory, endCategory, popIndex) {
  const outlined = W.buckets.outlined;
  const halfWidth = 0.4;
  const length = frontZ - backZ;
  addBlock(outlined, [centerX - halfWidth, FLOOR_Y, backZ], [centerX + halfWidth, 0.37, frontZ], { color: '#5b5f66' });
  addBlock(outlined, [centerX - 0.03, 0.37, backZ], [centerX + 0.03, 1.5, frontZ], { color: '#efe9dc' });
  const shelfLevels = [0.37, 0.72, 1.07, 1.42];
  shelfLevels.forEach((shelfY, level) => {
    for (const side of [-1, 1]) {
      const outer = centerX + side * halfWidth;
      const inner = centerX + side * 0.03;
      addBlock(outlined, [Math.min(inner, outer), shelfY, backZ], [Math.max(inner, outer), shelfY + 0.025, frontZ], { color: '#f3efe6' });
      addBlock(W.buckets.plain, [outer - 0.01, shelfY - 0.03, backZ], [outer + 0.01, shelfY + 0.025, frontZ], { color: '#ffffff', faces: { [side > 0 ? FACE.px : FACE.nx]: { map: W.atlasRects.priceStrip } } });
      const maxHeight = level < shelfLevels.length - 1 ? shelfLevels[level + 1] - shelfY - 0.05 : 0.28;
      placeProducts([outer, frontZ], [0, -1], [side, 0], length, shelfY + 0.025, maxHeight, side < 0 ? leftCategory : rightCategory);
    }
  });
  addBlock(outlined, [centerX - halfWidth, FLOOR_Y, backZ - 0.03], [centerX + halfWidth, 1.5, backZ], { color: '#e2dccf' });
  addBlock(outlined, [centerX - halfWidth, FLOOR_Y, frontZ], [centerX + halfWidth, 1.5, frontZ + 0.03], { color: '#e2dccf' });
  // End cap facing the windows.
  for (const shelfY of [0.62, 1.02]) {
    addBlock(outlined, [centerX - halfWidth, shelfY, frontZ + 0.03], [centerX + halfWidth, shelfY + 0.025, frontZ + 0.3], { color: '#f3efe6' });
    placeProducts([centerX - halfWidth + 0.02, frontZ + 0.3], [1, 0], [0, 1], halfWidth * 2 - 0.04, shelfY + 0.025, 0.3, endCategory);
  }
  addBlock(outlined, [centerX - 0.32, 1.5, frontZ - 0.01], [centerX + 0.32, 1.72, frontZ + 0.01], { color: '#ffffff', faces: { [FACE.pz]: { map: getSubRect(W.atlasRects.popSigns, popIndex, 0, 4, 1) } } });
}
