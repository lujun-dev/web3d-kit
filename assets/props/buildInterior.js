/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { withInterior } from '../core/util.js';
import { buildAtmCorner } from './buildAtmCorner.js';
import { buildBentoCase } from './buildBentoCase.js';
import { buildCeilingLights } from './buildCeilingLights.js';
import { buildCounter } from './buildCounter.js';
import { buildEatIn } from './buildEatIn.js';
import { buildFridge } from './buildFridge.js';
import { buildGondola } from './buildGondola.js';
import { buildHangingSigns } from './buildHangingSigns.js';
import { buildIceFreezer } from './buildIceFreezer.js';
import { buildMagazineRack } from './buildMagazineRack.js';
import { buildStaffCorner } from './buildStaffCorner.js';
import { buildWallPosters } from './buildWallPosters.js';

/* buildInterior（props） */
export function buildInterior() {
  withInterior(0.4, () => {
    buildCeilingLights();
    buildFridge();
    buildBentoCase();
    buildAtmCorner();
    buildMagazineRack();
    buildGondola(-2.85, -2.9, -6.1, 'snacks', 'boxes', 'snacks', 0);
    buildGondola(-1.15, -2.9, -6.1, 'cups', 'snacks', 'boxes', 1);
    buildGondola(0.55, -4.35, -6.1, 'daily', 'boxes', 'cups', 2);
    buildIceFreezer();
    buildCounter();
    buildEatIn();
    buildHangingSigns();
    buildStaffCorner();
    buildWallPosters();
  });
}
