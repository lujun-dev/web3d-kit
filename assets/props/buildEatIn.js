/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { FLOOR_Y } from '../core/constants.js';
import { addBlock, addCylinder, addSphere } from '../core/geometry.js';

/* buildEatIn（props） */
export function buildEatIn() {
  const outlined = W.buckets.outlined;
  addBlock(outlined, [3.1, 1.0, -3.95], [3.62, 1.05, -1.25], { color: '#c9a275' });
  addBlock(outlined, [3.5, FLOOR_Y, -3.9], [3.58, 1.0, -1.3], { color: '#8f7050' });
  for (const z of [-1.75, -2.55, -3.35]) {
    addCylinder(outlined, [2.88, 0.75, z], 0.17, 0.06, { color: '#e98b3a' }, { segments: 18 });
    addCylinder(outlined, [2.88, 0.5, z], 0.025, 0.45, { color: '#9aa1a8' });
    addCylinder(outlined, [2.88, FLOOR_Y + 0.01, z], 0.19, 0.02, { color: '#6b727c' }, { segments: 18 });
  }
  addCylinder(outlined, [3.34, 1.1, -2.2], 0.036, 0.1, { color: '#ffffff' }, { topRadius: 0.042 });
  addCylinder(outlined, [3.34, 1.1, -2.2], 0.043, 0.035, { color: '#8a5a34' });
  addCylinder(outlined, [3.34, 1.156, -2.2], 0.044, 0.012, { color: '#f4f1ea' });
  addBlock(outlined, [3.3, 1.05, -3.4], [3.42, 1.17, -3.28], { color: '#dfe3e8' });
  addCylinder(outlined, [3.35, 1.11, -1.45], 0.06, 0.12, { color: '#c46a3a' }, { topRadius: 0.075 });
  addSphere(outlined, [3.35, 1.25, -1.45], 0.1, { color: '#4f8a4a' }, { isFaceted: true });
}
