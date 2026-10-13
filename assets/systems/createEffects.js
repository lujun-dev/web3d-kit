/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { CHANNEL } from '../core/constants.js';
import { createLightCone } from '../core/materials.js';
import { createBaseShadow } from './createBaseShadow.js';
import { createDrips } from './createDrips.js';
import { createOverflowStream } from './createOverflowStream.js';
import { createRain } from './createRain.js';
import { createSplashes } from './createSplashes.js';
import { createSteam } from './createSteam.js';

/* createEffects（systems） */
export function createEffects() {
  createRain();
  createSplashes();
  createDrips();
  createOverflowStream();
  createSteam([2.2, 1.2, -4.7], 10, 0.7, 0.12, 0.12, 0.35);
  createSteam([2.22, 1.4, -6.35], 6, 0.5, 0.08, 0.09, 0.3);
  createSteam([3.34, 1.17, -2.2], 5, 0.35, 0.04, 0.05, 0.4);
  createLightCone([-5.0, 6.3, 9.3], 6.25, 2.7, 0xcfe6ff, 0.1, CHANNEL.steady);
  createLightCone([-7.8, 4.74, 5.73], 4.6, 1.8, 0xd2ecff, 0.08, CHANNEL.securityLight);
  for (const x of [-3.4, -0.6, 1.9]) {
    createLightCone([x, 2.83, -0.3], 2.65, 0.9, 0xffd9a0, 0.05, CHANNEL.interiorLights);
  }
  createLightCone([-7.18, 2.6, -4.6], 2.4, 1.1, 0xffb46b, 0.05, CHANNEL.alleyLamp);
  createBaseShadow();
}
