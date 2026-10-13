/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { BRAND, CHANNEL, COLORS, FACE, LOT_Y } from '../core/constants.js';
import { addBlock, addCylinder, withTransform } from '../core/geometry.js';

/* buildPoleSign（props） */
export function buildPoleSign() {
  withTransform([-4.75, LOT_Y, 3.25], Math.PI / 4, () => {
    const outlined = W.buckets.outlined;
    const face = { channel: CHANNEL.poleSign, color: '#ffffff', emissive: 0.8, map: W.atlasRects.poleSignFace };
    const subFace = { channel: CHANNEL.poleSignSub, color: '#ffffff', emissive: 0.85, map: W.atlasRects.poleSignSub };
    addBlock(outlined, [-0.35, 0, -0.35], [0.35, 0.3, 0.35], { color: COLORS.concrete });
    addCylinder(outlined, [0, 3.55, 0], 0.13, 6.5, { color: '#9aa1ab' }, { segments: 14 });
    addBlock(outlined, [-0.85, 5.0, -0.19], [0.85, 6.7, 0.19], { channel: CHANNEL.poleSign, color: BRAND.navy, emissive: 0.3, faces: { [FACE.pz]: face, [FACE.nz]: face } });
    addBlock(outlined, [-0.9, 6.7, -0.22], [0.9, 6.8, 0.22], { color: BRAND.navy });
    addBlock(outlined, [-0.65, 4.3, -0.15], [0.65, 4.8, 0.15], { color: BRAND.navy, faces: { [FACE.pz]: subFace, [FACE.nz]: subFace } });
  });
}
