/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { random } from '../core/math.js';

/* drawBlockWall（regions） */
export function drawBlockWall(context, width, height) {
  context.fillStyle = '#8f9296';
  context.fillRect(0, 0, width, height);
  const rows = 7;
  const blockHeight = height / rows;
  const blockWidth = width / 5;
  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : blockWidth / 2;
    for (let x = -blockWidth; x < width + blockWidth; x += blockWidth) {
      const shade = 138 + Math.floor(random() * 18);
      context.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;
      context.fillRect(x + offset + 2, row * blockHeight + 2, blockWidth - 4, blockHeight - 4);
    }
  }
  const stain = context.createLinearGradient(0, 0, 0, height);
  stain.addColorStop(0, 'rgba(40, 45, 50, 0.35)');
  stain.addColorStop(0.3, 'rgba(40, 45, 50, 0)');
  stain.addColorStop(0.85, 'rgba(60, 90, 50, 0)');
  stain.addColorStop(1, 'rgba(60, 90, 50, 0.35)');
  context.fillStyle = stain;
  context.fillRect(0, 0, width, height);
}
