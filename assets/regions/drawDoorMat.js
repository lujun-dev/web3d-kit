/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';
import { drawStar } from './drawStar.js';

/* drawDoorMat（regions） */
export function drawDoorMat(context, width, height) {
  context.fillStyle = '#34383f';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#5b616b';
  context.lineWidth = 8;
  context.strokeRect(10, 10, width - 20, height - 20);
  drawStar(context, width * 0.18, height * 0.5, height * 0.18, '#5b616b');
  drawText(context, 'WELCOME', width * 0.58, height * 0.4, { color: '#8e959e', family: FONT_ROUNDED, size: height * 0.22, spacing: 4, weight: 800 });
  drawText(context, 'ほしぞらマート', width * 0.58, height * 0.68, { color: '#6b727c', family: FONT_ROUNDED, size: height * 0.13, weight: 800 });
}
