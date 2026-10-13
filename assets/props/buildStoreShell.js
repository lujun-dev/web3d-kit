/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { getSubRect } from '../core/canvas.js';
import {
  BRAND,
  CHANNEL,
  COLORS,
  FACE,
  FLOOR_Y,
  LOT_Y,
} from '../core/constants.js';
import { addBlock, addCylinder, addPanel, addRod } from '../core/geometry.js';

/* buildStoreShell（props） */
export function buildStoreShell() {
  const outlined = W.buckets.outlined;
  const glass = W.buckets.exteriorGlass;
  const aluminum = { color: COLORS.aluminum };
  const darkTrim = { color: COLORS.darkTrim };
  const interiorFace = { color: COLORS.interiorWall, interior: 0.34 };

  addBlock(outlined, [-5.2, LOT_Y, -8.0], [3.8, FLOOR_Y, -1.0], { color: '#b9b5ab', faces: { [FACE.py]: { color: '#ffffff', interior: 0.34, map: W.atlasRects.storeFloor } } });
  addBlock(outlined, [-5.2, FLOOR_Y, -8.0], [-5.0, 3.05, -1.2], { color: COLORS.exteriorWall, faces: { [FACE.px]: interiorFace } });
  addBlock(outlined, [-5.0, FLOOR_Y, -8.0], [3.6, 3.05, -7.8], { color: COLORS.exteriorWall, faces: { [FACE.pz]: interiorFace } });
  addBlock(outlined, [3.6, FLOOR_Y, -8.0], [3.8, 3.05, -4.1], { color: COLORS.exteriorWall, faces: { [FACE.nx]: interiorFace } });
  addBlock(outlined, [-5.0, 3.0, -7.8], [3.6, 3.05, -1.2], { color: '#f6f3ec', interior: 0.38 });
  addBlock(outlined, [-5.2, 3.05, -8.0], [3.8, 3.55, -1.0], { color: COLORS.exteriorWall, faces: { [FACE.py]: { color: '#ffffff', map: W.atlasRects.roofSurface } } });

  // Parapet and coping.
  addBlock(outlined, [-5.2, 3.55, -1.15], [3.8, 4.0, -1.0], { color: COLORS.exteriorWall });
  addBlock(outlined, [3.65, 3.55, -8.0], [3.8, 4.0, -1.15], { color: COLORS.exteriorWall });
  addBlock(outlined, [-5.2, 3.55, -8.0], [-5.05, 4.0, -1.15], { color: COLORS.exteriorWall });
  addBlock(outlined, [-5.05, 3.55, -8.0], [3.65, 4.0, -7.85], { color: COLORS.exteriorWall });
  addBlock(outlined, [-5.3, 4.0, -1.2], [3.97, 4.06, -0.84], { color: '#e3e5e8' });
  addBlock(outlined, [3.6, 4.0, -8.05], [3.97, 4.06, -1.2], { color: '#e3e5e8' });
  addBlock(outlined, [-5.25, 4.0, -8.05], [-5.0, 4.06, -1.2], { color: '#e3e5e8' });
  addBlock(outlined, [-5.0, 4.0, -8.05], [3.6, 4.06, -7.8], { color: '#e3e5e8' });

  // Front facade.
  addBlock(outlined, [-5.2, FLOOR_Y, -1.2], [-5.0, 2.7, -1.0], aluminum);
  addBlock(outlined, [3.6, FLOOR_Y, -1.2], [3.8, 2.7, -1.0], aluminum);
  addBlock(outlined, [-5.2, 2.7, -1.2], [3.8, 3.05, -1.0], darkTrim);
  for (const [minX, maxX] of [[-3.3, -3.2], [-1.5, -1.4], [0.2, 0.3], [0.95, 1.05], [2.75, 2.85]]) {
    addBlock(outlined, [minX, FLOOR_Y, -1.2], [maxX, 2.7, -1.06], aluminum);
  }
  addBlock(outlined, [1.05, 2.44, -1.2], [2.75, 2.52, -1.06], aluminum);
  addBlock(outlined, [-5.0, FLOOR_Y, -1.16], [0.95, 0.4, -1.08], darkTrim);
  addBlock(outlined, [2.85, FLOOR_Y, -1.16], [3.6, 0.4, -1.08], darkTrim);
  for (const [minX, maxX] of [[-5.0, -3.3], [-3.2, -1.5], [-1.4, 0.2], [0.3, 0.95], [2.85, 3.6]]) {
    addPanel(glass, [(minX + maxX) / 2, 1.55, -1.12], maxX - minX, 2.3, '+z', {});
  }
  addPanel(glass, [1.9, 2.61, -1.12], 1.7, 0.18, '+z', {});

  // Right facade (glass toward the corner, solid wall behind the vending machines).
  addBlock(outlined, [3.6, FLOOR_Y, -4.1], [3.8, 2.7, -3.95], aluminum);
  addBlock(outlined, [3.66, FLOOR_Y, -2.65], [3.8, 2.7, -2.55], aluminum);
  addBlock(outlined, [3.6, 2.7, -4.1], [3.8, 3.05, -1.2], darkTrim);
  addBlock(outlined, [3.64, FLOOR_Y, -3.95], [3.72, 0.4, -1.2], darkTrim);
  addPanel(glass, [3.72, 1.55, -3.3], 1.3, 2.3, '+x', {});
  addPanel(glass, [3.72, 1.55, -1.875], 1.35, 2.3, '+x', {});

  // Backlit sign bands.
  const signGlow = { channel: CHANNEL.storeSign, color: BRAND.cream, emissive: 0.45 };
  addBlock(outlined, [-5.3, 3.05, -1.0], [3.94, 3.97, -0.86], { ...signGlow, faces: { [FACE.pz]: { channel: CHANNEL.storeSign, color: '#ffffff', emissive: 1.05, map: W.atlasRects.signFront } } });
  addBlock(outlined, [3.8, 3.05, -8.0], [3.94, 3.97, -1.0], { ...signGlow, faces: { [FACE.px]: { channel: CHANNEL.storeSign, color: '#ffffff', emissive: 1.05, map: W.atlasRects.signSide } } });

  // Canopy with gutter, downspout and downlights.
  addBlock(outlined, [-5.3, 2.86, -1.0], [3.94, 2.98, 0.35], { color: '#ebe8e0', faces: { [FACE.pz]: { color: BRAND.sky }, [FACE.py]: { color: '#8a9199' } } });
  addBlock(outlined, [-5.3, 2.9, 0.35], [3.94, 3.0, 0.45], { color: '#9aa1a8' });
  addRod(outlined, [-5.24, 2.95, 0.4], [-5.24, 0.66, 0.4], 0.045, { color: '#9aa1a8' });
  addRod(outlined, [-5.24, 0.7, 0.4], [-5.24, 0.52, 0.6], 0.045, { color: '#9aa1a8' });
  addBlock(outlined, [-5.45, LOT_Y, 0.45], [-5.05, LOT_Y + 0.03, 0.85], { color: '#2a2d33' });
  for (const x of [-3.4, -0.6, 1.9]) {
    addCylinder(outlined, [x, 2.85, -0.3], 0.1, 0.02, { channel: CHANNEL.interiorLights, color: '#fff6e4', emissive: 4 }, { segments: 16 });
  }

  // Door sensor with its tiny status light.
  addBlock(outlined, [1.72, 2.52, -1.08], [2.08, 2.62, -1.0], { color: '#2a2d33' });
  addBlock(outlined, [1.86, 2.55, -1.0], [1.94, 2.59, -0.99], { channel: CHANNEL.doorSensor, color: '#ff4a3a', emissive: 3 });

  // Exterior wall panel seams, vents and a drain pipe so the side and back walls are not blank.
  const seam = { color: '#aeb2b9' };
  for (const y of [1.2, 2.15]) {
    addBlock(outlined, [-5.23, y, -7.98], [-5.2, y + 0.04, -1.22], seam);
    addBlock(outlined, [-5.18, y, -8.03], [2.4, y + 0.04, -8.0], seam);
    addBlock(outlined, [3.35, y, -8.03], [3.78, y + 0.04, -8.0], seam);
    addBlock(outlined, [3.8, y, -7.98], [3.83, y + 0.04, -4.12], seam);
  }
  for (const x of [-2.3, 0.6]) {
    addBlock(outlined, [x, FLOOR_Y, -8.03], [x + 0.04, 3.05, -8.0], seam);
  }
  for (const z of [-5.9, -3.6]) {
    addBlock(outlined, [-5.23, FLOOR_Y, z], [-5.2, 3.05, z + 0.04], seam);
  }
  addBlock(outlined, [-3.4, 2.35, -8.12], [-2.9, 2.75, -8.0], { color: '#9aa1a8' });
  addBlock(outlined, [-3.38, 2.37, -8.13], [-2.92, 2.73, -8.12], { color: '#3a3f47' });
  addBlock(outlined, [1.3, 2.4, -8.1], [1.6, 2.7, -8.0], { color: '#394150', emissive: 0.15 });
  addRod(outlined, [3.7, 3.55, -8.06], [3.7, LOT_Y, -8.06], 0.045, { color: '#9aa1a8' });
  addRod(outlined, [-5.26, 3.55, -7.9], [-5.26, LOT_Y, -7.9], 0.045, { color: '#9aa1a8' });

  // Posters and stickers behind the glass.
  const posters = W.atlasRects.windowPosters;
  addPanel(outlined, [-4.3, 2.1, -1.14], 0.5, 0.7, '+z', { interior: 0.35, map: getSubRect(posters, 0, 0, 4, 1) });
  addPanel(outlined, [-2.5, 2.1, -1.14], 0.5, 0.7, '+z', { interior: 0.35, map: getSubRect(posters, 1, 0, 4, 1) });
  addPanel(outlined, [-0.75, 2.1, -1.14], 0.5, 0.7, '+z', { interior: 0.35, map: getSubRect(posters, 2, 0, 4, 1) });
  addPanel(outlined, [3.22, 2.05, -1.14], 0.5, 0.7, '+z', { interior: 0.35, map: getSubRect(posters, 3, 0, 4, 1) });
  addPanel(outlined, [0.62, 2.28, -1.14], 0.56, 0.21, '+z', { channel: CHANNEL.steady, emissive: 1.8, map: W.atlasRects.openSign });
  addPanel(outlined, [3.7, 1.2, -1.6], 0.4, 0.13, '+x', { interior: 0.3, map: W.atlasRects.wifiSticker });
  addPanel(outlined, [3.7, 1.2, -2.2], 0.4, 0.13, '+x', { interior: 0.3, map: W.atlasRects.eatInSticker });
  addPanel(outlined, [3.7, 1.2, -3.1], 0.26, 0.13, '+x', { interior: 0.3, map: W.atlasRects.atmSticker });
}
