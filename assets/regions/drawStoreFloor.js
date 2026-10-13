/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle, fillEllipse, fillRoundedRect } from '../core/canvas.js';
import { BRAND, FONT_ROUNDED } from '../core/constants.js';
import { random, randomBetween } from '../core/math.js';

/* drawStoreFloor（regions） */
export function drawStoreFloor(context, width, height) {
  const scaleX = width / 9;
  const scaleY = height / 7;
  const toFloorX = (x) => {
    return (x + 5.2) * scaleX;
  };
  const toFloorY = (z) => {
    return (z + 8.0) * scaleY;
  };
  context.fillStyle = '#efe7d7';
  context.fillRect(0, 0, width, height);
  const tile = 0.3 * scaleX;
  for (let y = 0; y < height; y += tile) {
    for (let x = 0; x < width; x += tile) {
      const shade = 230 + Math.floor(random() * 10);
      context.fillStyle = `rgb(${shade + 8}, ${shade}, ${shade - 16})`;
      context.fillRect(x + 1, y + 1, tile - 2, tile - 2);
    }
  }
  context.strokeStyle = 'rgba(160, 140, 110, 0.35)';
  context.lineWidth = 1.5;
  for (let y = 0; y <= height; y += tile) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  for (let x = 0; x <= width; x += tile) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  // Tracked-in rain near the automatic door.
  for (let index = 0; index < 26; index += 1) {
    const x = toFloorX(randomBetween(0.9, 2.9));
    const y = toFloorY(randomBetween(-2.6, -1.1));
    fillEllipse(context, x, y, randomBetween(6, 18), randomBetween(4, 10), random() * 3, 'rgba(120, 110, 95, 0.16)');
  }
  // Queue guide in front of the register.
  const stickerX = toFloorX(1.4);
  const stickerY = toFloorY(-3.55);
  fillRoundedRect(context, stickerX - 58, stickerY - 20, 116, 40, 12, '#ffd449');
  drawText(context, 'こちらにお並びください', stickerX, stickerY, { color: BRAND.navy, family: FONT_ROUNDED, maxWidth: 104, size: 14, weight: 800 });
  for (const z of [-2.95, -2.35, -1.75]) {
    for (const side of [-1, 1]) {
      const footX = toFloorX(1.4 + side * 0.09);
      const footY = toFloorY(z);
      fillEllipse(context, footX, footY, 6, 12, 0, 'rgba(59, 166, 230, 0.8)');
      fillCircle(context, footX, footY - 14, 4.5, 'rgba(59, 166, 230, 0.8)');
    }
  }
  context.setLineDash([10, 8]);
  context.strokeStyle = 'rgba(59, 166, 230, 0.7)';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(toFloorX(0.98), toFloorY(-4.3));
  context.lineTo(toFloorX(1.82), toFloorY(-4.3));
  context.stroke();
  context.setLineDash([]);
  // Arrow toward the drinks.
  context.fillStyle = 'rgba(99, 183, 91, 0.75)';
  const arrowX = toFloorX(-2.0);
  const arrowY = toFloorY(-6.55);
  context.beginPath();
  context.moveTo(arrowX, arrowY - 26);
  context.lineTo(arrowX + 18, arrowY - 4);
  context.lineTo(arrowX + 7, arrowY - 4);
  context.lineTo(arrowX + 7, arrowY + 20);
  context.lineTo(arrowX - 7, arrowY + 20);
  context.lineTo(arrowX - 7, arrowY - 4);
  context.lineTo(arrowX - 18, arrowY - 4);
  context.closePath();
  context.fill();
}
