/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { renderFrame } from './renderFrame.js';
import { trackPerformance } from './trackPerformance.js';
import { updateCat } from './updateCat.js';
import { updateChannels } from './updateChannels.js';
import { updateDoor } from './updateDoor.js';
import { updateDrips } from './updateDrips.js';
import { updateFans } from './updateFans.js';
import { updateOverflowStream } from './updateOverflowStream.js';
import { updateSplashes } from './updateSplashes.js';

/* animate（systems） */
export function animate() {
  const deltaTime = Math.min(W.clock.getDelta(), 0.1);
  W.elapsedTime += deltaTime;
  W.sharedUniforms.uTime.value = W.elapsedTime;
  W.controls.update(deltaTime);
  updateDoor(deltaTime);
  updateChannels(W.elapsedTime);
  updateFans(deltaTime);
  updateCat(W.elapsedTime);
  updateSplashes(W.elapsedTime);
  updateDrips(W.elapsedTime);
  updateOverflowStream(W.elapsedTime);
  renderFrame(deltaTime);
  trackPerformance(deltaTime);
}
