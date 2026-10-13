/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import { BRAND, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock, addBox } from '../core/geometry.js';
import { random } from '../core/math.js';

/* buildMagazineRack（props） */
export function buildMagazineRack() {
  const outlined = W.buckets.outlined;
  addBlock(outlined, [-4.25, FLOOR_Y, -1.72], [0.1, 0.45, -1.24], { color: '#d9d3c7' });
  addBlock(outlined, [-4.25, 0.45, -1.32], [0.1, 1.15, -1.24], { color: '#e4dfd4', faces: { [FACE.pz]: { color: BRAND.navy } } });
  for (let tier = 0; tier < 3; tier += 1) {
    const baseY = 0.47 + tier * 0.23;
    const frontZ = -1.44 - (2 - tier) * 0.1;
    addBlock(outlined, [-4.25, baseY - 0.02, frontZ - 0.06], [0.1, baseY, -1.32], { color: '#cfc9bd' });
    addBlock(outlined, [-4.25, baseY, frontZ - 0.06], [0.1, baseY + 0.05, frontZ - 0.04], { color: '#cfc9bd' });
    for (let x = -4.13; x < -0.05; x += 0.23) {
      const rect = getSubRect(W.atlasRects.magazines, Math.floor(random() * 8), Math.floor(random() * 4), 8, 4);
      addBox(W.buckets.plain, [x + 0.1, baseY + 0.15, frontZ + 0.02], [0.21, 0.28, 0.012], { color: '#ffffff', faces: { [FACE.nz]: { map: rect } } }, [0.25, 0, 0]);
    }
  }
}
