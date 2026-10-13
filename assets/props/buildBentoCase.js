/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillCaseTier } from '../core/canvas.js';
import { BRAND, CHANNEL, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock } from '../core/geometry.js';

/* buildBentoCase（props） */
export function buildBentoCase() {
  const outlined = W.buckets.outlined;
  const plain = W.buckets.plain;
  const minZ = -7.05;
  const maxZ = -3.0;
  addBlock(outlined, [-5.0, FLOOR_Y, minZ], [-4.3, 0.72, maxZ], { color: '#e9e6df', faces: { [FACE.px]: { color: BRAND.sky } } });
  addBlock(plain, [-5.0, 0.72, minZ], [-4.92, 2.05, maxZ], { channel: CHANNEL.interiorLights, color: '#f7f2e6', emissive: 0.7 });
  addBlock(outlined, [-5.0, 0.72, maxZ - 0.04], [-4.3, 2.25, maxZ], { color: '#dcd8cf' });
  addBlock(outlined, [-5.0, 0.72, minZ], [-4.3, 2.25, minZ + 0.04], { color: '#dcd8cf' });
  addBlock(outlined, [-5.0, 2.05, minZ], [-4.45, 2.25, maxZ], { color: '#ffffff', faces: { [FACE.px]: { channel: CHANNEL.interiorLights, emissive: 1.0, interior: 0, map: W.atlasRects.caseSign } } });
  [0.74, 1.06, 1.38, 1.7].forEach((tierY, tier) => {
    const frontX = -4.34 - tier * 0.05;
    addBlock(plain, [-4.92, tierY, minZ + 0.04], [frontX, tierY + 0.02, maxZ - 0.04], { color: '#dfe5ea' });
    addBlock(plain, [frontX - 0.01, tierY - 0.02, minZ + 0.04], [frontX + 0.01, tierY + 0.04, maxZ - 0.04], { color: '#ffffff', faces: { [FACE.px]: { map: W.atlasRects.priceStrip } } });
    addBlock(plain, [-4.9, tierY + 0.28, minZ + 0.05], [frontX + 0.05, tierY + 0.295, maxZ - 0.05], { channel: CHANNEL.interiorLights, color: '#ffffff', emissive: 0.9, interior: 0 });
    fillCaseTier(tier, tierY + 0.02, frontX, minZ + 0.08, maxZ - 0.08);
  });
}
