/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillEllipse } from '../core/canvas.js';

/* drawCurtainWindow（regions） */
export function drawCurtainWindow(context, width, height, isTelevision) {
  const light = context.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.7);
  light.addColorStop(0, isTelevision ? '#e4f0ff' : '#ffe6b0');
  light.addColorStop(1, isTelevision ? '#7f9fd6' : '#f0a860');
  context.fillStyle = light;
  context.fillRect(0, 0, width, height);
  context.fillStyle = isTelevision ? 'rgba(210, 225, 255, 0.55)' : 'rgba(255, 214, 160, 0.75)';
  for (let fold = 0; fold < 5; fold += 1) {
    context.fillRect(fold * width * 0.07, 0, width * 0.045, height);
    context.fillRect(width - (fold + 1) * width * 0.07, 0, width * 0.045, height);
  }
  context.fillStyle = '#3b3129';
  context.fillRect(0, 0, width, 8);
  context.fillRect(0, height - 8, width, 8);
  context.fillRect(0, 0, 8, height);
  context.fillRect(width - 8, 0, 8, height);
  context.fillRect(width / 2 - 4, 0, 8, height);
  if (!isTelevision) {
    fillEllipse(context, width * 0.3, height * 0.82, 14, 22, 0, 'rgba(60, 70, 40, 0.8)');
    context.fillStyle = 'rgba(90, 50, 30, 0.8)';
    context.fillRect(width * 0.3 - 10, height * 0.86, 20, 16);
  }
}
