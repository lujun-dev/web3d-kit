/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { randomBetween } from '../core/math.js';

/* updateDoor（systems） */
export function updateDoor(deltaTime) {
  W.door.timer -= deltaTime;
  switch (W.door.phase) {
    case 'closed': {
      if (W.door.timer <= 0) {
        W.door.phase = 'opening';
      }
      break;
    }
    case 'opening': {
      W.door.openAmount = Math.min(1, W.door.openAmount + deltaTime / 0.9);
      if (W.door.openAmount >= 1) {
        W.door.phase = 'open';
        W.door.timer = randomBetween(2.2, 3.4);
      }
      break;
    }
    case 'open': {
      if (W.door.timer <= 0) {
        W.door.phase = 'closing';
      }
      break;
    }
    case 'closing': {
      W.door.openAmount = Math.max(0, W.door.openAmount - deltaTime / 1.25);
      if (W.door.openAmount <= 0) {
        W.door.phase = 'closed';
        W.door.timer = randomBetween(8, 15);
      }
      break;
    }
  }
  const eased = W.door.openAmount * W.door.openAmount * (3 - 2 * W.door.openAmount);
  W.door.leftPanel.position.x = 1.475 - 0.75 * eased;
  W.door.rightPanel.position.x = 2.325 + 0.75 * eased;
}
