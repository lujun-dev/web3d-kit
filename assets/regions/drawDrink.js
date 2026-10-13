/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { fillRoundedRect, traceRoundedRect } from '../core/canvas.js';
import { pickRandom } from '../core/math.js';

/* drawDrink（regions） */
export function drawDrink(context, centerX, bottomY, width, height, color, isCan) {
  if (isCan) {
    const canWidth = width * 0.78;
    const canHeight = height * 0.72;
    fillRoundedRect(context, centerX - canWidth / 2, bottomY - canHeight, canWidth, canHeight, canWidth * 0.12, color);
    context.fillStyle = 'rgba(255, 255, 255, 0.85)';
    context.fillRect(centerX - canWidth / 2, bottomY - canHeight * 0.62, canWidth, canHeight * 0.18);
    context.fillStyle = '#c9ced6';
    context.fillRect(centerX - canWidth / 2, bottomY - canHeight, canWidth, canHeight * 0.07);
    context.fillStyle = 'rgba(255, 255, 255, 0.45)';
    context.fillRect(centerX - canWidth * 0.32, bottomY - canHeight * 0.9, canWidth * 0.12, canHeight * 0.78);
    return;
  }
  const bodyWidth = width * 0.7;
  const bodyHeight = height * 0.62;
  context.fillStyle = color;
  traceRoundedRect(context, centerX - bodyWidth / 2, bottomY - bodyHeight, bodyWidth, bodyHeight, bodyWidth * 0.18);
  context.fill();
  context.beginPath();
  context.moveTo(centerX - bodyWidth / 2, bottomY - bodyHeight + 4);
  context.quadraticCurveTo(centerX - bodyWidth / 2, bottomY - height * 0.8, centerX - bodyWidth * 0.18, bottomY - height * 0.84);
  context.lineTo(centerX + bodyWidth * 0.18, bottomY - height * 0.84);
  context.quadraticCurveTo(centerX + bodyWidth / 2, bottomY - height * 0.8, centerX + bodyWidth / 2, bottomY - bodyHeight + 4);
  context.closePath();
  context.fill();
  context.fillRect(centerX - bodyWidth * 0.18, bottomY - height * 0.92, bodyWidth * 0.36, height * 0.1);
  context.fillStyle = pickRandom(['#ffffff', '#f24b3a', '#2f6fd6', '#1f2d5c', '#ffd449']);
  context.fillRect(centerX - bodyWidth * 0.2, bottomY - height, bodyWidth * 0.4, height * 0.09);
  context.fillStyle = 'rgba(255, 255, 255, 0.88)';
  context.fillRect(centerX - bodyWidth / 2, bottomY - bodyHeight * 0.7, bodyWidth, bodyHeight * 0.32);
  context.fillStyle = 'rgba(255, 255, 255, 0.45)';
  context.fillRect(centerX - bodyWidth * 0.34, bottomY - height * 0.78, bodyWidth * 0.12, height * 0.7);
}
