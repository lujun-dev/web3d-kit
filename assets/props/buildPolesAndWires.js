/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { LOT_Y } from '../core/constants.js';
import { addWire } from '../core/geometry.js';
import { getLeftPerpendicular } from '../core/util.js';
import { buildUtilityPole } from './buildUtilityPole.js';

/* buildPolesAndWires（props） */
export function buildPolesAndWires() {
  const first = [-7.8, 4.95];
  const second = [0.9, 11.2];
  const third = [11.2, -5.5];
  const firstArm = getLeftPerpendicular(first[0], first[1], second[0], second[1]);
  const thirdArm = getLeftPerpendicular(second[0], second[1], third[0], third[1]);
  const middleArmRaw = [firstArm[0] + thirdArm[0], firstArm[1] + thirdArm[1]];
  const middleLength = Math.hypot(middleArmRaw[0], middleArmRaw[1]);
  const middleArm = [middleArmRaw[0] / middleLength, middleArmRaw[1] / middleLength];
  const poleOne = buildUtilityPole({ adRect: W.atlasRects.poleAdDentist, armDirection: firstArm, guyDirection: [-1, 0], hasSecurityLight: true, hasTransformer: true, x: first[0], z: first[1] });
  const poleTwo = buildUtilityPole({ adRect: W.atlasRects.poleAdRealty, armDirection: middleArm, hasTransformer: false, x: second[0], z: second[1] });
  const poleThree = buildUtilityPole({ armDirection: thirdArm, guyDirection: [0, -1], hasTransformer: true, x: third[0], z: third[1] });
  for (let index = 0; index < 3; index += 1) {
    addWire(poleOne.top[index], poleTwo.top[index], 0.55, 0.016);
    addWire(poleTwo.top[index], poleThree.top[index], 0.75, 0.016);
  }
  for (let index = 0; index < 2; index += 1) {
    addWire(poleOne.middle[index], poleTwo.middle[index], 0.5, 0.016);
    addWire(poleTwo.middle[index], poleThree.middle[index], 0.7, 0.016);
  }
  addWire(poleOne.cable, poleTwo.cable, 0.4, 0.03);
  addWire(poleTwo.cable, poleThree.cable, 0.55, 0.03);
  addWire([poleOne.x, LOT_Y + 6.3, poleOne.z], [-5.1, 3.95, -1.1], 0.25, 0.012);
  addWire([poleOne.x, LOT_Y + 6.1, poleOne.z], [-7.45, 5.7, -2.3], 0.2, 0.012);
  addWire(poleThree.cable, [11.2, LOT_Y + 5.7, -10.8], 0.15, 0.02);
}
