/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import { CATEGORY_SIGNS, CHANNEL, COLORS, FACE } from '../core/constants.js';
import { addBlock, addRod } from '../core/geometry.js';

/* buildHangingSigns（props） */
export function buildHangingSigns() {
  const signs = [
    { index: 0, x: -3.75, z: -4.3 },
    { index: 1, x: -2.0, z: -4.9 },
    { index: 2, x: -0.3, z: -4.3 },
    { index: 4, x: 1.4, z: -5.4 },
  ];
  for (const sign of signs) {
    const rect = getSubRect(W.atlasRects.categorySigns, 0, sign.index, 1, CATEGORY_SIGNS.length);
    const channel = sign.index === 1 ? CHANNEL.hangingSign : CHANNEL.interiorLights;
    const litFace = { channel, emissive: 1.2, interior: 0, map: rect };
    addBlock(W.buckets.outlined, [sign.x - 0.5, 2.45, sign.z - 0.03], [sign.x + 0.5, 2.7, sign.z + 0.03], { channel, color: '#ffffff', emissive: 0.3, faces: { [FACE.pz]: litFace, [FACE.nz]: litFace } });
    addRod(W.buckets.outlined, [sign.x - 0.35, 2.7, sign.z], [sign.x - 0.35, 3.0, sign.z], 0.006, { color: COLORS.pole }, 4);
    addRod(W.buckets.outlined, [sign.x + 0.35, 2.7, sign.z], [sign.x + 0.35, 3.0, sign.z], 0.006, { color: COLORS.pole }, 4);
  }
}
