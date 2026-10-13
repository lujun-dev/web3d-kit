/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { BRAND, CHANNEL, COLORS, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock, addBox, addCylinder, addPanel, addRod } from '../core/geometry.js';

/* buildCounter（props） */
export function buildCounter() {
  const outlined = W.buckets.outlined;
  const plain = W.buckets.plain;
  const glass = W.buckets.interiorGlass;
  addBlock(outlined, [1.85, FLOOR_Y, -7.0], [2.5, 0.95, -4.4], { color: '#f2eee6', faces: { [FACE.nx]: { color: '#ffffff', map: W.atlasRects.counterFront } } });
  addBlock(outlined, [1.8, 0.95, -7.05], [2.6, 1.0, -4.35], { color: '#d8c3a0' });

  // Oden pot.
  addBlock(outlined, [1.97, 1.0, -4.93], [2.43, 1.17, -4.47], { color: '#c7ccd2', faces: { [FACE.py]: { channel: CHANNEL.steady, color: '#ffffff', emissive: 0.35, map: W.atlasRects.oden } } });
  addBlock(outlined, [1.95, 1.17, -4.95], [2.45, 1.2, -4.91], { color: '#b8bec6' });
  addBlock(outlined, [1.95, 1.17, -4.49], [2.45, 1.2, -4.45], { color: '#b8bec6' });

  // Hot snack case.
  addBlock(outlined, [1.95, 1.0, -5.62], [2.45, 1.05, -5.08], { color: '#9aa1a8' });
  addBlock(outlined, [2.4, 1.05, -5.62], [2.45, 1.42, -5.08], { color: '#9aa1a8' });
  addBlock(outlined, [1.95, 1.42, -5.62], [2.45, 1.46, -5.08], { channel: CHANNEL.interiorLights, color: '#ffffff', emissive: 1.5, interior: 0 });
  addBox(plain, [2.2, 1.17, -5.35], [0.4, 0.012, 0.5], { channel: CHANNEL.steady, color: '#ffffff', emissive: 0.6, faces: { [FACE.py]: { map: W.atlasRects.hotSnack } } }, [0, 0, 0.35]);
  addPanel(glass, [1.95, 1.235, -5.35], 0.54, 0.37, '-x', {});
  addPanel(glass, [2.2, 1.235, -5.08], 0.5, 0.37, '+z', {});
  addPanel(glass, [2.2, 1.235, -5.62], 0.5, 0.37, '-z', {});
  addPanel(outlined, [1.94, 1.52, -5.35], 0.5, 0.1, '-x', { channel: CHANNEL.interiorLights, emissive: 0.8, map: W.atlasRects.hotSnackLabel });

  // Registers.
  for (const z of [-5.95, -6.75]) {
    addBlock(outlined, [2.05, 1.0, z - 0.2], [2.45, 1.07, z + 0.2], { color: '#3a3f47' });
    addBox(outlined, [2.33, 1.2, z], [0.03, 0.22, 0.3], { color: '#2a2e35', faces: { [FACE.px]: { channel: CHANNEL.interiorLights, color: '#bfe3ff', emissive: 1.2 } } }, [0, 0, -0.3]);
    addRod(outlined, [2.1, 1.07, z + 0.12], [2.1, 1.28, z + 0.12], 0.012, { color: '#3a3f47' });
    addBlock(outlined, [2.05, 1.26, z + 0.04], [2.08, 1.38, z + 0.2], { color: '#2a2e35', faces: { [FACE.nx]: { channel: CHANNEL.interiorLights, color: '#8fd3ff', emissive: 1.0 } } });
    addBlock(outlined, [2.1, 1.07, z - 0.18], [2.2, 1.1, z - 0.06], { color: '#1d2025' });
  }

  // Steamed-bun warmer.
  addBlock(outlined, [2.0, 1.0, -6.5], [2.45, 1.38, -6.2], { color: '#c7ccd2', faces: { [FACE.nx]: { channel: CHANNEL.steady, color: '#ffffff', emissive: 0.6, map: W.atlasRects.nikuman } } });

  // Coffee corner.
  addBlock(outlined, [1.9, FLOOR_Y, -4.05], [2.6, 0.95, -3.45], { color: '#f2eee6', faces: { [FACE.pz]: { color: BRAND.navy } } });
  addBlock(outlined, [1.95, 0.95, -3.95], [2.32, 1.6, -3.55], { color: '#2c3036', faces: { [FACE.pz]: { channel: CHANNEL.steady, color: '#ffffff', emissive: 0.25, map: W.atlasRects.coffeeMachine } } });
  addCylinder(outlined, [2.44, 1.05, -3.7], 0.04, 0.2, { color: '#ffffff' }, { topRadius: 0.046 });
  addCylinder(outlined, [2.52, 1.04, -3.82], 0.04, 0.18, { color: '#8a5a34' }, { topRadius: 0.046 });

  // Menu board above the registers.
  addBlock(outlined, [2.18, 2.2, -6.4], [2.22, 2.62, -4.8], { color: '#1b2233', faces: { [FACE.nx]: { channel: CHANNEL.interiorLights, color: '#ffffff', emissive: 1.0, map: W.atlasRects.menuBoard } } });
  addRod(outlined, [2.2, 2.62, -6.2], [2.2, 3.0, -6.2], 0.01, { color: COLORS.pole }, 4);
  addRod(outlined, [2.2, 2.62, -5.0], [2.2, 3.0, -5.0], 0.01, { color: COLORS.pole }, 4);

  // Clerk side: back counter and the tobacco wall.
  addBlock(outlined, [3.2, FLOOR_Y, -7.6], [3.6, 1.0, -4.4], { color: '#d8d2c4' });
  addBlock(outlined, [3.35, 1.15, -7.6], [3.6, 2.55, -4.4], { color: '#23272e', faces: { [FACE.nx]: { channel: CHANNEL.interiorLights, color: '#ffffff', emissive: 0.55, map: W.atlasRects.cigarettes } } });
}
