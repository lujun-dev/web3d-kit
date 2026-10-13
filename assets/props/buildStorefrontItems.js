/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { BRAND, COLORS, FACE, LOT_Y } from '../core/constants.js';
import { addBlock, addCylinder, addPanel, addRod, addUmbrella } from '../core/geometry.js';

/* buildStorefrontItems（props） */
export function buildStorefrontItems() {
  const outlined = W.buckets.outlined;
  const metal = { color: COLORS.metal };
  addBlock(outlined, [1.12, LOT_Y, -0.98], [2.68, LOT_Y + 0.02, -0.08], { color: '#34383f', faces: { [FACE.py]: { color: '#ffffff', map: W.atlasRects.doorMat } } });

  // Umbrella stand with three closed umbrellas.
  addBlock(outlined, [3.12, LOT_Y, -0.88], [3.58, LOT_Y + 0.06, -0.5], metal);
  for (const [x, z] of [[3.14, -0.86], [3.56, -0.86], [3.14, -0.52], [3.56, -0.52]]) {
    addRod(outlined, [x, LOT_Y, z], [x, LOT_Y + 0.62, z], 0.012, metal, 5);
  }
  addRod(outlined, [3.14, LOT_Y + 0.6, -0.86], [3.56, LOT_Y + 0.6, -0.86], 0.012, metal, 5);
  addRod(outlined, [3.14, LOT_Y + 0.6, -0.52], [3.56, LOT_Y + 0.6, -0.52], 0.012, metal, 5);
  addRod(outlined, [3.14, LOT_Y + 0.6, -0.86], [3.14, LOT_Y + 0.6, -0.52], 0.012, metal, 5);
  addRod(outlined, [3.56, LOT_Y + 0.6, -0.86], [3.56, LOT_Y + 0.6, -0.52], 0.012, metal, 5);
  addUmbrella([3.24, LOT_Y + 0.06, -0.78], '#dfe6ea', [0.08, 0, -0.06]);
  addUmbrella([3.44, LOT_Y + 0.06, -0.64], BRAND.navy, [-0.06, 0, 0.08]);
  addUmbrella([3.3, LOT_Y + 0.06, -0.6], '#c2413b', [0.1, 0, 0.1]);

  // Wet-umbrella bag dispenser.
  addCylinder(outlined, [0.62, LOT_Y + 0.01, -0.72], 0.14, 0.02, metal, { segments: 16 });
  addRod(outlined, [0.62, LOT_Y, -0.72], [0.62, LOT_Y + 1.0, -0.72], 0.018, metal);
  addBlock(outlined, [0.48, LOT_Y + 1.0, -0.78], [0.76, LOT_Y + 1.14, -0.66], { color: '#ffffff', faces: { [FACE.pz]: { map: W.atlasRects.umbrellaBag } } });

  // Trash station.
  addBlock(outlined, [-1.3, LOT_Y, -0.98], [0.2, LOT_Y + 0.95, -0.55], { color: '#6f5a48', faces: { [FACE.py]: { color: '#5b4a3b' } } });
  addPanel(outlined, [-0.55, LOT_Y + 0.62, -0.545], 1.44, 0.36, '+z', { map: W.atlasRects.trashLabels });

  // Parking wheel stops and the P sign.
  for (const x of [-2.2, 0.2]) {
    addBlock(outlined, [x - 0.7, LOT_Y, 0.9], [x + 0.7, LOT_Y + 0.12, 1.04], { color: '#9a9ca3', faces: { [FACE.py]: { color: '#d9b233' } } });
  }
}
