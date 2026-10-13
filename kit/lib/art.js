/* 古风纹理绘制：全部 Canvas 程序化生成，不引外部图片/字体文件 */

const CJK = '"STKaiti","KaiTi","Kaiti SC","SimSun","Songti SC","Noto Serif SC","Microsoft YaHei",serif';

function cv(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export function paintText(ctx, string, x, y, options = {}) {
  const {
    size = 24, color = '#ffffff', family = CJK, weight = 700,
    align = 'center', baseline = 'middle', spacing = 0,
    stroke = '', strokeWidth = 0, shadow = 0,
  } = options;
  ctx.save();
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`;
  if (shadow > 0) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = shadow;
    ctx.shadowOffsetY = shadow * 0.45;
  }
  if (stroke && strokeWidth > 0) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.strokeText(string, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(string, x, y);
  ctx.restore();
}

export function paintVertical(ctx, string, x, y, size, options = {}) {
  const chars = Array.from(string);
  for (let i = 0; i < chars.length; i += 1) {
    paintText(ctx, chars[i], x, y + i * size * 1.1, { ...options, size });
  }
}

function grain(ctx, w, h, count, colors, alpha, width) {
  for (let i = 0; i < count; i += 1) {
    const y = Math.random() * h;
    ctx.strokeStyle = colors[(Math.random() * colors.length) | 0];
    ctx.globalAlpha = alpha * (0.35 + Math.random() * 0.65);
    ctx.lineWidth = width * (0.5 + Math.random());
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.3, y + (Math.random() - 0.5) * 14, w * 0.7, y + (Math.random() - 0.5) * 14, w, y + (Math.random() - 0.5) * 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function speckle(ctx, w, h, count, colors, minimum, maximum) {
  for (let i = 0; i < count; i += 1) {
    const r = minimum + Math.random() * (maximum - minimum);
    ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
    ctx.globalAlpha = 0.25 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ---------------------------------------------------------------- 牌匾 / 招牌 */

// 横匾：黑漆描金
export function plaque(ctx, w, h, string, opt = {}) {
  const bg = opt.bg || '#2b1a0e';
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#3d2614');
  gradient.addColorStop(0.45, bg);
  gradient.addColorStop(1, '#1a0f07');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 26, ['#b8874f', '#5a3a1e', '#1d1108'], 0.28, h * 0.02);
  // 金边
  ctx.strokeStyle = opt.border || '#c2963c';
  ctx.lineWidth = h * 0.05;
  ctx.strokeRect(h * 0.07, h * 0.1, w - h * 0.14, h - h * 0.2);
  ctx.strokeStyle = 'rgba(255,228,164,0.4)';
  ctx.lineWidth = h * 0.012;
  ctx.strokeRect(h * 0.17, h * 0.22, w - h * 0.34, h - h * 0.44);
  // 卷草角饰
  ctx.fillStyle = opt.border || '#c2963c';
  for (const cx of [h * 0.19, w - h * 0.19]) {
    for (const cy of [h * 0.26, h - h * 0.26]) {
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  paintText(ctx, string, w / 2, h * 0.53, {
    size: h * 0.58, color: opt.fg || '#e9c46a', spacing: h * 0.07, shadow: h * 0.07,
  });
}

// 竖招牌：白木底黑字（也有红底金字）
export function verticalSign(ctx, w, h, string, opt = {}) {
  const bg = opt.bg || '#efe3c8';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 30, ['#d9c9a6', '#c9b791'], 0.3, w * 0.03);
  ctx.strokeStyle = opt.border || '#8c6b3f';
  ctx.lineWidth = w * 0.07;
  ctx.strokeRect(w * 0.06, w * 0.06, w * 0.88, h - w * 0.12);
  const size = w * 0.52;
  const startY = h * 0.5 - ((string.length - 1) * size * 1.1) / 2;
  paintVertical(ctx, string, w / 2, startY, size, { color: opt.fg || '#20150c' });
}

// 布幌：布面 + 上下木条 + 流苏感
export function clothBanner(ctx, w, h, string, opt = {}) {
  ctx.fillStyle = opt.bg || '#f2e7cd';
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 18, ['#e0d2b4', '#d3c3a2'], 0.35, w * 0.04);
  ctx.fillStyle = 'rgba(120,80,40,0.16)';
  ctx.fillRect(0, h * 0.86, w, h * 0.14);
  ctx.strokeStyle = opt.border || '#9c3a2c';
  ctx.lineWidth = w * 0.09;
  ctx.strokeRect(w * 0.1, h * 0.05, w * 0.8, h * 0.9);
  const size = w * 0.5;
  const startY = h * 0.46 - ((string.length - 1) * size * 1.12) / 2;
  paintVertical(ctx, string, w / 2, startY, size, { color: opt.fg || '#8f2f22' });
}

// 价目木牌
export function menuBoard(ctx, w, h, rows, opt = {}) {
  ctx.fillStyle = opt.bg || '#8a5a34';
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 40, ['#6f4526', '#a06b3f', '#5c3820'], 0.32, h * 0.02);
  ctx.strokeStyle = 'rgba(40,24,12,0.5)';
  ctx.lineWidth = w * 0.02;
  ctx.strokeRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92);
  const size = Math.min(w * 0.16, h / (rows.length * 1.9));
  rows.forEach((row, index) => {
    const y = h * 0.5 + (index - (rows.length - 1) / 2) * size * 1.75;
    paintText(ctx, row, w * 0.5, y, { size, color: '#20150c', spacing: size * 0.04 });
  });
}

// 灯笼正面：红底金字 + 上下金箍
export function lanternFace(ctx, w, h, string) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#d8452c');
  gradient.addColorStop(0.5, '#b8331f');
  gradient.addColorStop(1, '#8e2413');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < 14; i += 1) {
    ctx.fillRect(i * (w / 14) + w / 28, 0, w / 60, h);
  }
  ctx.fillStyle = '#d9a94a';
  ctx.fillRect(0, 0, w, h * 0.075);
  ctx.fillRect(0, h * 0.925, w, h * 0.075);
  if (string) {
    paintText(ctx, string, w * 0.5, h * 0.54, { size: h * 0.52, color: '#f7dd9c', spacing: w * 0.02 });
  }
}

/* ------------------------------------------------------------------ 糕点 */

export function cakeTop(ctx, w, h, string, opt = {}) {
  ctx.fillStyle = opt.bg || '#efe0bd';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(150,120,70,0.35)';
  ctx.lineWidth = w * 0.02;
  ctx.strokeRect(w * 0.02, h * 0.02, w * 0.96, h * 0.96);
  if (string === '桂花糕') {
    const n = 4;
    for (let i = 1; i < n; i += 1) {
      ctx.beginPath(); ctx.moveTo((i * w) / n, 0); ctx.lineTo((i * w) / n, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i * h) / n); ctx.lineTo(w, (i * h) / n); ctx.stroke();
    }
    speckle(ctx, w, h, 60, ['#d99a3a', '#c07c22'], w * 0.012, w * 0.03);
  } else if (string === '绿豆糕') {
    speckle(ctx, w, h, 120, ['#8fa05a', '#a7b572'], w * 0.008, w * 0.022);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(w * 0.12, h * 0.12, w * 0.76, h * 0.1);
  } else if (string === '月饼') {
    const cx = w / 2; const cy = h / 2; const r = w * 0.44;
    ctx.strokeStyle = 'rgba(120,70,30,0.55)';
    ctx.lineWidth = w * 0.035;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.66, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r * 0.68, cy + Math.sin(angle) * r * 0.68);
      ctx.lineTo(cx + Math.cos(angle) * r * 0.96, cy + Math.sin(angle) * r * 0.96);
      ctx.stroke();
    }
  } else if (string === '糖糕') {
    speckle(ctx, w, h, 80, ['#f0d79a', '#b8823c'], w * 0.01, w * 0.03);
  }
}

/* ------------------------------------------------------- 可平铺材质（瓦/木/石/窗） */

export function tileTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#525b66';
  ctx.fillRect(0, 0, w, h);
  const cols = 8;
  const cw = w / cols;
  for (let i = 0; i < cols; i += 1) {
    const x = i * cw;
    const gradient = ctx.createLinearGradient(x, 0, x + cw, 0);
    gradient.addColorStop(0, '#3f4750');
    gradient.addColorStop(0.35, '#6b747f');
    gradient.addColorStop(0.62, '#5b646f');
    gradient.addColorStop(1, '#3b434c');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, cw, h);
  }
  // 横向瓦楞（上下搭接）
  for (let row = 0; row < 4; row += 1) {
    const y = (row * h) / 4;
    ctx.fillStyle = 'rgba(20,24,30,0.35)';
    ctx.fillRect(0, y, w, h * 0.035);
    ctx.fillStyle = 'rgba(180,190,200,0.16)';
    ctx.fillRect(0, y + h * 0.035, w, h * 0.014);
  }
  speckle(ctx, w, h, 90, ['#3b434c', '#78818c'], 1, 2.6);
  return canvas;
}

export function woodTexture(base = '#8a5a34', dark = '#5c3820') {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 70, [dark, '#a9764a', dark], 0.3, 1.6);
  speckle(ctx, w, h, 60, [dark, '#c08b57'], 0.6, 1.8);
  return canvas;
}

export function stoneTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3a3b3c';
  ctx.fillRect(0, 0, w, h);
  const rows = 4;
  for (let r = 0; r < rows; r += 1) {
    const cells = r % 2 === 0 ? 2 : 3;
    const ch = h / rows;
    for (let c = 0; c < cells; c += 1) {
      const x = (c * w) / cells;
      const cwid = w / cells;
      const shade = 62 + Math.random() * 26;
      ctx.fillStyle = `rgb(${shade | 0},${(shade * 1.01) | 0},${(shade * 1.05) | 0})`;
      ctx.fillRect(x + 2, r * ch + 2, cwid - 4, ch - 4);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x + 2, r * ch + 2, cwid - 4, 3);
    }
  }
  speckle(ctx, w, h, 260, ['#2c2d2e', '#8b8d90'], 0.8, 3.2);
  return canvas;
}

export function paperTexture() {
  const w = 128; const h = 128;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#ffe8b8');
  gradient.addColorStop(0.55, '#ffd786');
  gradient.addColorStop(1, '#dfa95c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(64,36,16,0.85)';
  ctx.lineWidth = 5;
  for (let i = 0; i <= 4; i += 1) {
    const p = (i * w) / 4;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
  }
  return canvas;
}

export function brickTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#6d675c';
  ctx.fillRect(0, 0, w, h);
  const rows = 6;
  for (let r = 0; r < rows; r += 1) {
    const bh = h / rows;
    const offset = r % 2 ? w / 8 : 0;
    for (let c = -1; c < 4; c += 1) {
      const bw = w / 4;
      const x = c * bw + offset;
      const shade = 88 + Math.random() * 30;
      ctx.fillStyle = `rgb(${shade | 0},${(shade * 0.95) | 0},${(shade * 0.85) | 0})`;
      ctx.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
    }
  }
  speckle(ctx, w, h, 150, ['#4d483f', '#a8a294'], 0.8, 2.4);
  return canvas;
}

/* -------------------------------------------------------------- 光效贴图 */

export function roundGlowTexture(inner = 'rgba(255,214,150,0.95)', outer = 'rgba(255,150,60,0)') {
  const size = 256;
  const canvas = cv(size, size);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.32, 'rgba(255,180,90,0.42)');
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

export function rainStreakTexture() {
  const w = 16; const h = 96;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, 'rgba(200,220,255,0)');
  gradient.addColorStop(0.5, 'rgba(214,232,255,0.85)');
  gradient.addColorStop(1, 'rgba(200,220,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(w / 2 - 1.2, 0, 2.4, h);
  return canvas;
}

/* 泥墙 / 抹灰：柔和斑驳 + 底部返潮 + 细裂缝，避免大面积纯色在夜里读成"白板" */
export function plasterTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.55, '#f2ede4');
  gradient.addColorStop(1, '#d8cfc0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  // 细密斑驳
  for (let i = 0; i < 1400; i += 1) {
    const r = 1 + Math.random() * 5;
    const dark = Math.random() < 0.55;
    ctx.fillStyle = dark ? 'rgba(120,108,90,0.055)' : 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // 竖向水痕
  ctx.strokeStyle = 'rgba(110,100,84,0.075)';
  for (let i = 0; i < 26; i += 1) {
    const x = Math.random() * w;
    ctx.lineWidth = 1 + Math.random() * 2.4;
    ctx.beginPath();
    ctx.moveTo(x, Math.random() * h * 0.35);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, h);
    ctx.stroke();
  }
  // 底部返潮（贴图底部更暗更灰）
  const damp = ctx.createLinearGradient(0, h * 0.72, 0, h);
  damp.addColorStop(0, 'rgba(70,62,50,0)');
  damp.addColorStop(1, 'rgba(70,62,50,0.34)');
  ctx.fillStyle = damp;
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
  // 几道细裂纹
  ctx.strokeStyle = 'rgba(96,86,70,0.5)';
  for (let i = 0; i < 5; i += 1) {
    ctx.lineWidth = 1;
    let x = Math.random() * w; let y = Math.random() * h * 0.6;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 5; k += 1) { x += (Math.random() - 0.5) * 22; y += 6 + Math.random() * 12; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  return canvas;
}

