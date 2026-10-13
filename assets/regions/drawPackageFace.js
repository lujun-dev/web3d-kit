/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';
import { drawGloss } from './drawGloss.js';

/* drawPackageFace（regions） */
export function drawPackageFace(context, width, height, row, base, accent, word) {
  switch (row) {
    case 0: {
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let x = 0; x < width; x += 6) {
        context.fillRect(x, 0, 3, 5);
        context.fillRect(x, height - 5, 3, 5);
      }
      fillEllipse(context, width * 0.5, height * 0.64, width * 0.32, height * 0.15, 0, '#f6d27a');
      fillEllipse(context, width * 0.36, height * 0.6, width * 0.14, height * 0.07, 0.4, '#e9b44c');
      fillEllipse(context, width * 0.64, height * 0.68, width * 0.13, height * 0.06, -0.3, '#efc25e');
      drawText(context, word, width / 2, height * 0.3, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.92, size: height * 0.2, stroke: accent, strokeWidth: 5, weight: 800 });
      drawGloss(context, 0, 0, width, height, 0.4);
      break;
    }
    case 1: {
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);
      context.fillStyle = accent;
      context.fillRect(0, 0, width, height * 0.22);
      context.fillStyle = 'rgba(255, 255, 255, 0.85)';
      context.fillRect(0, height * 0.8, width, height * 0.06);
      fillCircle(context, width * 0.5, height * 0.58, width * 0.2, 'rgba(255, 255, 255, 0.9)');
      fillCircle(context, width * 0.5, height * 0.58, width * 0.13, '#7b4a2b');
      drawText(context, word, width / 2, height * 0.11, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.9, size: height * 0.14, weight: 800 });
      break;
    }
    case 2: {
      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, base);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      fillRoundedRect(context, width * 0.12, height * 0.36, width * 0.76, height * 0.34, 8, accent);
      drawText(context, word, width / 2, height * 0.53, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.7, size: height * 0.13, weight: 800 });
      drawGloss(context, 0, 0, width * 0.5, height, 0.5);
      break;
    }
    case 3: {
      context.fillStyle = '#f6f2e8';
      context.fillRect(0, 0, width, height);
      context.fillStyle = accent;
      context.fillRect(0, height * 0.12, width, height * 0.3);
      context.fillStyle = base === '#f6f2e8' ? '#d23a5f' : base;
      context.fillRect(0, height * 0.82, width, height * 0.08);
      drawText(context, word, width / 2, height * 0.27, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.9, size: height * 0.16, stroke: 'rgba(0, 0, 0, 0.25)', strokeWidth: 3, weight: 800 });
      fillEllipse(context, width * 0.5, height * 0.62, width * 0.3, height * 0.1, 0, '#f2c46a');
      fillCircle(context, width * 0.4, height * 0.6, width * 0.07, '#e36b4a');
      fillCircle(context, width * 0.62, height * 0.63, width * 0.06, '#5a9e4b');
      break;
    }
  }
}
