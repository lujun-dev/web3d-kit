/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { COLORS, FACE, FLOOR_Y } from '../core/constants.js';
import { addBlock, addBox, addCylinder, addSphere } from '../core/geometry.js';

/* buildStaffCorner（props） */
export function buildStaffCorner() {
  const outlined = W.buckets.outlined;
  addBlock(outlined, [2.65, FLOOR_Y, -7.8], [3.45, 2.3, -7.76], { color: '#b8bcc4' });
  addBlock(outlined, [2.9, 1.5, -7.76], [3.2, 1.95, -7.75], { color: '#394150', emissive: 0.1 });
  addBlock(outlined, [2.75, 2.32, -7.79], [3.35, 2.47, -7.76], { color: '#ffffff', faces: { [FACE.pz]: { map: W.atlasRects.staffSign } } });
  addSphere(outlined, [3.35, 1.05, -7.73], 0.03, { color: COLORS.silver });
  addCylinder(outlined, [3.05, 2.72, -7.77], 0.15, 0.04, { color: '#ffffff', faces: { 1: { map: W.atlasRects.clock } } }, { rotation: [Math.PI / 2, 0, 0], segments: 20 });
  for (let level = 0; level < 3; level += 1) {
    addBlock(outlined, [2.0, FLOOR_Y + level * 0.2, -7.7], [2.5, FLOOR_Y + level * 0.2 + 0.19, -7.3], { color: level % 2 === 0 ? '#3b7fd1' : '#f29e38' });
  }
  // Wet-floor board just inside the door.
  addBox(outlined, [0.62, 0.52, -1.66], [0.3, 0.52, 0.02], { color: '#ffd21f', faces: { [FACE.pz]: { map: W.atlasRects.wetFloor } } }, [0.2, 0, 0]);
  addBox(outlined, [0.62, 0.52, -1.86], [0.3, 0.52, 0.02], { color: '#ffd21f' }, [-0.2, 0, 0]);
}
