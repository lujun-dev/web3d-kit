/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import { W } from '../core/world.js';
import { drawText, fillCircle } from '../core/canvas.js';
import { FONT_ROUNDED } from '../core/constants.js';
import { randomBetween } from '../core/math.js';
import { sprinkle } from '../core/util.js';

/* drawBulletinBoard（regions） */
export function drawBulletinBoard(context, width, height) {
  context.fillStyle = '#6b4a32';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#c29461';
  context.fillRect(12, 12, width - 24, height - 24);
  sprinkle(context, width, height, 900, ['rgba(120, 80, 40, 0.25)', 'rgba(255, 230, 190, 0.2)'], 1, 3);
  const notices = [
    { color: '#ffffff', height: 150, text: '町内会のお知らせ', textColor: '#1f2d5c', width: 120, x: 24, y: 24 },
    { color: '#f29e38', height: 130, text: '夏祭り', textColor: '#ffffff', width: 110, x: 156, y: 30 },
    { color: '#fffdf2', height: 170, text: '迷い猫', textColor: '#d62828', width: 118, x: 278, y: 22 },
    { color: '#ffd449', height: 110, text: '防災訓練', textColor: '#d62828', width: 96, x: 404, y: 40 },
    { color: '#e6f4e8', height: 110, text: 'ゴミ出しルール', textColor: '#2f7d4f', width: 150, x: 40, y: 186 },
    { color: '#ffffff', height: 100, text: '回覧板', textColor: '#1f2d5c', width: 100, x: 206, y: 176 },
  ];
  for (const notice of notices) {
    context.save();
    context.translate(notice.x + notice.width / 2, notice.y + notice.height / 2);
    context.rotate(randomBetween(-0.05, 0.05));
    context.fillStyle = notice.color;
    context.fillRect(-notice.width / 2, -notice.height / 2, notice.width, notice.height);
    drawText(context, notice.text, 0, -notice.height / 2 + 20, { color: notice.textColor, family: FONT_ROUNDED, maxWidth: notice.width - 12, size: 18, weight: 800 });
    context.fillStyle = 'rgba(60, 60, 70, 0.35)';
    for (let line = 0; line < 5; line += 1) {
      context.fillRect(-notice.width / 2 + 10, -notice.height / 2 + 42 + line * 14, notice.width * randomBetween(0.4, 0.8), 4);
    }
    fillCircle(context, 0, -notice.height / 2 + 6, 5, '#d62828');
    context.restore();
  }
  // Lost cat poster sketch.
  const catX = 337;
  const catY = 118;
  fillCircle(context, catX, catY, 26, '#f3efe6');
  context.strokeStyle = '#3a3a3a';
  context.lineWidth = 3;
  context.beginPath();
  context.arc(catX, catY, 26, 0, Math.PI * 2);
  context.moveTo(catX - 22, catY - 12);
  context.lineTo(catX - 18, catY - 38);
  context.lineTo(catX - 4, catY - 24);
  context.moveTo(catX + 22, catY - 12);
  context.lineTo(catX + 18, catY - 38);
  context.lineTo(catX + 4, catY - 24);
  context.stroke();
  fillCircle(context, catX - 9, catY - 2, 3, '#3a3a3a');
  fillCircle(context, catX + 9, catY - 2, 3, '#3a3a3a');
  drawText(context, 'さがしています', catX, catY + 48, { color: '#1f2d5c', family: FONT_ROUNDED, maxWidth: 108, size: 14, weight: 800 });
  context.fillStyle = '#4a3322';
  context.fillRect(0, height - 12, width, 12);
}
