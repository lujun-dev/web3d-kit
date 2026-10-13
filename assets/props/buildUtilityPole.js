/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL, COLORS, FACE, LOT_Y } from '../core/constants.js';
import { addBlock, addBox, addCylinder, addRod } from '../core/geometry.js';

/* buildUtilityPole（props） */
export function buildUtilityPole(options) {
  const outlined = W.buckets.outlined;
  const { adRect, armDirection, guyDirection, hasSecurityLight, hasTransformer, x, z } = options;
  const [armX, armZ] = armDirection;
  const perpendicularX = -armZ;
  const perpendicularZ = armX;
  addCylinder(outlined, [x, LOT_Y + 4.5, z], 0.17, 9.0, { color: '#b4afa4' }, { segments: 14, topRadius: 0.12 });
  addCylinder(outlined, [x, LOT_Y + 0.95, z], 0.18, 1.7, { channel: CHANNEL.steady, color: '#ffffff', emissive: 0.12, map: W.atlasRects.poleGuard }, { segments: 14 });
  for (let index = 0; index < 11; index += 1) {
    const y = LOT_Y + 2.4 + index * 0.45;
    const sign = index % 2 === 0 ? 1 : -1;
    addRod(outlined, [x, y, z], [x + perpendicularX * sign * 0.3, y, z + perpendicularZ * sign * 0.3], 0.012, { color: '#6b6f75' }, 5);
  }
  const topY = LOT_Y + 8.75;
  const middleY = LOT_Y + 8.2;
  addRod(outlined, [x - armX * 0.95, topY, z - armZ * 0.95], [x + armX * 0.95, topY, z + armZ * 0.95], 0.045, { color: '#6d737b' }, 6);
  addRod(outlined, [x - armX * 0.7, middleY, z - armZ * 0.7], [x + armX * 0.7, middleY, z + armZ * 0.7], 0.04, { color: '#6d737b' }, 6);
  const top = [];
  for (const offset of [-0.78, 0, 0.78]) {
    const pointX = x + armX * offset;
    const pointZ = z + armZ * offset;
    addCylinder(outlined, [pointX, topY + 0.09, pointZ], 0.04, 0.12, { color: '#e8e4dc' }, { segments: 8, topRadius: 0.03 });
    top.push([pointX, topY + 0.16, pointZ]);
  }
  const middle = [];
  for (const offset of [-0.55, 0.55]) {
    const pointX = x + armX * offset;
    const pointZ = z + armZ * offset;
    addCylinder(outlined, [pointX, middleY + 0.08, pointZ], 0.035, 0.1, { color: '#e8e4dc' }, { segments: 8, topRadius: 0.028 });
    middle.push([pointX, middleY + 0.14, pointZ]);
  }
  const cable = [x, LOT_Y + 5.6, z];
  addCylinder(outlined, [x, LOT_Y + 5.6, z], 0.19, 0.12, { color: '#3a3d42' }, { segments: 10 });
  if (hasTransformer) {
    const transformerX = x - perpendicularX * 0.42;
    const transformerZ = z - perpendicularZ * 0.42;
    addCylinder(outlined, [transformerX, LOT_Y + 6.6, transformerZ], 0.27, 0.75, { color: '#9da4ab' }, { segments: 14 });
    addCylinder(outlined, [transformerX, LOT_Y + 7.02, transformerZ], 0.29, 0.08, { color: '#8a9198' }, { segments: 14 });
    addRod(outlined, [x, LOT_Y + 6.3, z], [transformerX, LOT_Y + 6.3, transformerZ], 0.03, { color: '#6d737b' }, 5);
    addRod(outlined, [x, LOT_Y + 6.9, z], [transformerX, LOT_Y + 6.9, transformerZ], 0.03, { color: '#6d737b' }, 5);
    for (const offset of [-0.12, 0.12]) {
      addCylinder(outlined, [transformerX + armX * offset, LOT_Y + 7.14, transformerZ + armZ * offset], 0.025, 0.1, { color: '#e8e4dc' }, { segments: 6 });
    }
  }
  if (hasSecurityLight) {
    addRod(outlined, [x, LOT_Y + 4.75, z], [x, LOT_Y + 4.85, z + 0.72], 0.02, { color: '#8a9198' }, 5);
    addBox(outlined, [x, LOT_Y + 4.83, z + 0.78], [0.52, 0.09, 0.14], { color: '#e9ecef' });
    addBox(outlined, [x, LOT_Y + 4.775, z + 0.78], [0.42, 0.025, 0.08], { channel: CHANNEL.securityLight, color: '#e8f6ff', emissive: 4 });
  }
  if (adRect) {
    const adAngle = Math.atan2(perpendicularX, perpendicularZ);
    addBox(outlined, [x + perpendicularX * 0.2, LOT_Y + 2.75, z + perpendicularZ * 0.2], [0.3, 1.2, 0.02], { color: '#e8e8e2', faces: { [FACE.pz]: { map: adRect } } }, [0, adAngle, 0]);
    addBox(outlined, [x - armX * 0.2, LOT_Y + 2.05, z - armZ * 0.2], [0.34, 0.11, 0.015], { color: '#1f5aa8', faces: { [FACE.pz]: { map: W.atlasRects.addressPlate } } }, [0, Math.atan2(-armX, -armZ), 0]);
  }
  if (guyDirection) {
    const anchor = [x + guyDirection[0] * 3.0, LOT_Y, z + guyDirection[1] * 3.0];
    const attach = [x, LOT_Y + 7.8, z];
    addRod(outlined, attach, anchor, 0.012, { color: '#2a2c30' }, 4);
    const guardEnd = [anchor[0] + (attach[0] - anchor[0]) * 0.26, anchor[1] + (attach[1] - anchor[1]) * 0.26, anchor[2] + (attach[2] - anchor[2]) * 0.26];
    addRod(outlined, anchor, guardEnd, 0.045, { channel: CHANNEL.steady, color: '#f2c230', emissive: 0.1 }, 8);
    addBlock(outlined, [anchor[0] - 0.12, LOT_Y, anchor[2] - 0.12], [anchor[0] + 0.12, LOT_Y + 0.05, anchor[2] + 0.12], { color: COLORS.concrete });
  }
  return { cable, middle, top, x, z };
}
