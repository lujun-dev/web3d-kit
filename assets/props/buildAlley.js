/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { addBlock, addCylinder } from '../core/geometry.js';
import { buildAcUnit } from './buildAcUnit.js';

/* buildAlley（props） */
export function buildAlley() {
  const outlined = W.buckets.outlined;
  buildAcUnit([-5.36, LOT_Y, -3.4], -Math.PI / 2);
  buildAcUnit([-5.36, LOT_Y, -6.2], -Math.PI / 2);
  addBlock(outlined, [-5.3, 0.55, -3.1], [-5.2, 3.5, -3.0], { color: '#ecebe4' });
  addBlock(outlined, [-5.3, 0.55, -5.9], [-5.2, 3.5, -5.8], { color: '#ecebe4' });
  for (let level = 0; level < 3; level += 1) {
    addBlock(outlined, [-7.2, LOT_Y + level * 0.28, -9.6], [-6.7, LOT_Y + level * 0.28 + 0.27, -9.0], { color: level % 2 === 0 ? '#f2c230' : '#2f64c9' });
  }
  addBlock(outlined, [-7.2, LOT_Y, -8.9], [-6.7, LOT_Y + 0.27, -8.3], { color: '#f2c230' });
  addCylinder(outlined, [-6.9, LOT_Y + 0.17, -7.8], 0.15, 0.34, { color: '#3b7fd1' }, { topRadius: 0.18 });
}
