/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { createDoorPanel } from './createDoorPanel.js';

/* createDoors（systems） */
export function createDoors() {
  W.door.leftPanel = createDoorPanel(1.475);
  W.door.rightPanel = createDoorPanel(2.325);
}
