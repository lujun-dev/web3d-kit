/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { COLORS, FACE, LOT_Y } from '../core/constants.js';
import { addBlock, addPanel, addRod } from '../core/geometry.js';

/* buildRoadSigns（props） */
export function buildRoadSigns() {
  const outlined = W.buckets.outlined;
  const cutout = W.buckets.cutout;
  const poleX = 11.2;
  const poleZ = 1.0;
  addRod(outlined, [poleX, LOT_Y, poleZ], [poleX, LOT_Y + 3.0, poleZ], 0.035, { color: COLORS.pole });
  addPanel(cutout, [poleX, LOT_Y + 2.72, poleZ - 0.06], 0.8, 0.8, '-z', { emissive: 0.15, map: W.atlasRects.stopSign });
  addPanel(cutout, [poleX, LOT_Y + 2.72, poleZ - 0.045], 0.8, 0.8, '+z', { map: W.atlasRects.signBack });
  addBlock(outlined, [poleX - 0.3, LOT_Y + 1.7, poleZ - 0.07], [poleX + 0.3, LOT_Y + 2.3, poleZ - 0.05], { color: '#9aa1a8', faces: { [FACE.nz]: { color: '#ffffff', emissive: 0.15, map: W.atlasRects.crosswalkSign } } });
  const cornerX = 5.05;
  const cornerZ = 5.05;
  addRod(outlined, [cornerX, LOT_Y, cornerZ], [cornerX, LOT_Y + 3.1, cornerZ], 0.035, { color: COLORS.pole });
  addBlock(outlined, [cornerX + 0.04, LOT_Y + 2.6, cornerZ - 0.48], [cornerX + 0.06, LOT_Y + 2.84, cornerZ + 0.48], { color: '#ffffff', faces: { [FACE.px]: { map: W.atlasRects.streetName }, [FACE.nx]: { map: W.atlasRects.streetName } } });
  addBlock(outlined, [cornerX - 0.48, LOT_Y + 2.25, cornerZ + 0.04], [cornerX + 0.48, LOT_Y + 2.49, cornerZ + 0.06], { color: '#ffffff', faces: { [FACE.pz]: { map: W.atlasRects.streetName }, [FACE.nz]: { map: W.atlasRects.streetName } } });
}
