/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';
import { pickRandom, random } from '../core/math.js';
import { drawDrink } from './drawDrink.js';
import { drawGloss } from './drawGloss.js';
import { drawStar } from './drawStar.js';

/* drawVendingFront（regions） */
export function drawVendingFront(context, width, height, bodyColor, trimColor) {
  context.fillStyle = bodyColor;
  context.fillRect(0, 0, width, height);
  context.fillStyle = trimColor;
  context.fillRect(0, 0, width, height * 0.065);
  fillRoundedRect(context, width * 0.06, height * 0.012, width * 0.36, height * 0.04, 8, '#2474d6');
  drawText(context, 'つめた～い', width * 0.24, height * 0.033, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.33, size: height * 0.026, weight: 800 });
  fillRoundedRect(context, width * 0.58, height * 0.012, width * 0.36, height * 0.04, 8, '#e0342c');
  drawText(context, 'あったか～い', width * 0.76, height * 0.033, { color: '#ffffff', family: FONT_ROUNDED, maxWidth: width * 0.33, size: height * 0.026, weight: 800 });
  const windowX = width * 0.06;
  const windowY = height * 0.08;
  const windowWidth = width * 0.88;
  const windowHeight = height * 0.52;
  const glow = context.createLinearGradient(0, windowY, 0, windowY + windowHeight);
  glow.addColorStop(0, '#f8fdff');
  glow.addColorStop(1, '#d4e7f1');
  context.fillStyle = glow;
  context.fillRect(windowX, windowY, windowWidth, windowHeight);
  const rows = 3;
  const columns = 6;
  const rowHeight = windowHeight / rows;
  const slotWidth = windowWidth / columns;
  const drinkColors = ['#e84a3c', '#2f6fd6', '#f29e38', '#63b75b', '#1f2d5c', '#f6cf45', '#8a6a2f', '#ffffff', '#27b3ac', '#d23a5f'];
  for (let row = 0; row < rows; row += 1) {
    const rowTop = windowY + row * rowHeight;
    for (let column = 0; column < columns; column += 1) {
      drawDrink(context, windowX + (column + 0.5) * slotWidth, rowTop + rowHeight * 0.76, slotWidth * 0.8, rowHeight * 0.66, pickRandom(drinkColors), random() < 0.45);
    }
    const isHot = row === rows - 1;
    context.fillStyle = isHot ? '#e0342c' : '#2474d6';
    context.fillRect(windowX, rowTop + rowHeight * 0.78, windowWidth, rowHeight * 0.17);
    for (let column = 0; column < columns; column += 1) {
      const slotX = windowX + (column + 0.5) * slotWidth;
      drawText(context, pickRandom(['100', '130', '160']), slotX - slotWidth * 0.12, rowTop + rowHeight * 0.868, { color: '#ffffff', size: rowHeight * 0.11, weight: 800 });
      fillCircle(context, slotX + slotWidth * 0.26, rowTop + rowHeight * 0.868, rowHeight * 0.045, '#9dff7a');
    }
  }
  drawGloss(context, windowX, windowY, windowWidth, windowHeight, 0.35);
  context.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  context.lineWidth = 6;
  context.strokeRect(windowX, windowY, windowWidth, windowHeight);
  fillRoundedRect(context, width * 0.06, height * 0.64, width * 0.52, height * 0.19, 14, 'rgba(255, 255, 255, 0.22)');
  drawDrink(context, width * 0.2, height * 0.815, width * 0.18, height * 0.16, trimColor, false);
  drawStar(context, width * 0.42, height * 0.7, width * 0.07, BRAND.lemon, '#ffffff', 3);
  fillRoundedRect(context, width * 0.64, height * 0.64, width * 0.3, height * 0.19, 10, '#2b2f36');
  context.fillStyle = '#0d0f12';
  context.fillRect(width * 0.7, height * 0.67, width * 0.04, height * 0.05);
  context.fillRect(width * 0.68, height * 0.75, width * 0.2, height * 0.012);
  context.fillStyle = '#ff3b2f';
  context.fillRect(width * 0.78, height * 0.665, width * 0.12, height * 0.035);
  drawText(context, 'おつり', width * 0.79, height * 0.8, { color: '#c9ced6', family: FONT_ROUNDED, size: height * 0.018, weight: 800 });
  fillRoundedRect(context, width * 0.08, height * 0.86, width * 0.84, height * 0.1, 10, '#15181c');
  drawText(context, 'とりだし口', width * 0.5, height * 0.91, { color: '#8e959e', family: FONT_ROUNDED, size: height * 0.022, weight: 800 });
}
