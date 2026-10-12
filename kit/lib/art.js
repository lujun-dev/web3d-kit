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

/* ======================================================================
   日式横丁（居酒屋）专用贴图：全部 Canvas 程序化，零外部素材
   ====================================================================== */

/* 瓦（和瓦）：一列列半圆瓦当 + 横向搭接 */
export function kawaraTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3f4652'; ctx.fillRect(0, 0, w, h);
  const cols = 8; const cw = w / cols;
  for (let i = 0; i < cols; i += 1) {
    const x = i * cw;
    const g = ctx.createLinearGradient(x, 0, x + cw, 0);
    g.addColorStop(0, '#2b313b'); g.addColorStop(0.4, '#59616e');
    g.addColorStop(0.65, '#4a525d'); g.addColorStop(1, '#2b313b');
    ctx.fillStyle = g; ctx.fillRect(x, 0, cw, h);
  }
  for (let r = 0; r < 5; r += 1) {
    const y = (r * h) / 5;
    ctx.fillStyle = 'rgba(16,19,24,0.5)'; ctx.fillRect(0, y, w, h * 0.03);
    ctx.fillStyle = 'rgba(190,200,215,0.18)'; ctx.fillRect(0, y + h * 0.03, w, h * 0.012);
  }
  for (let i = 0; i < 260; i += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(24,28,34,0.5)' : 'rgba(120,132,150,0.35)';
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 0.6 + Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas;
}

/* 下見板張り（横向木板墙）：杉木板 + 雨痕 */
export function sidingTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#7a5a3c'; ctx.fillRect(0, 0, w, h);
  const planks = 7; const ph = h / planks;
  for (let i = 0; i < planks; i += 1) {
    const y = i * ph;
    const shade = 0.86 + Math.random() * 0.22;
    ctx.fillStyle = `rgba(${Math.round(122 * shade)},${Math.round(90 * shade)},${Math.round(60 * shade)},1)`;
    ctx.fillRect(0, y, w, ph - 2);
    ctx.fillStyle = 'rgba(28,20,14,0.55)'; ctx.fillRect(0, y + ph - 3, w, 3);
    // 木目
    for (let k = 0; k < 9; k += 1) {
      ctx.strokeStyle = `rgba(70,48,30,${0.1 + Math.random() * 0.16})`;
      ctx.lineWidth = 0.8 + Math.random();
      const gy = y + Math.random() * ph;
      ctx.beginPath(); ctx.moveTo(0, gy);
      ctx.bezierCurveTo(w * 0.3, gy + (Math.random() - 0.5) * 4, w * 0.7, gy + (Math.random() - 0.5) * 4, w, gy);
      ctx.stroke();
    }
  }
  // 雨水垂痕
  for (let i = 0; i < 14; i += 1) {
    ctx.strokeStyle = 'rgba(48,40,32,0.16)'; ctx.lineWidth = 2 + Math.random() * 4;
    const x = Math.random() * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (Math.random() - 0.5) * 6, h); ctx.stroke();
  }
  return canvas;
}

/* 暖帘（のれん）：藏青布 + 白字 + 下摆开衩 */
export function norenTexture(chars = '呑み処', opts = {}) {
  const w = 320; const h = 200;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  const base = opts.base || '#1f2c46';
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, base); g.addColorStop(1, '#16203a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // 布纹
  for (let i = 0; i < 900; i += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
  }
  // 下摆开衩（三条缝）
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  for (const k of [1, 2]) ctx.fillRect((w * k) / 3 - 1.5, h * 0.42, 3, h * 0.58);
  // 上下加固条
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, w, h * 0.08);
  ctx.fillRect(0, h * 0.92, w, h * 0.08);
  // 大字
  const list = Array.from(chars);
  const size = Math.min(h * 0.46, (w / list.length) * 0.72);
  list.forEach((ch, i) => {
    const x = (w / list.length) * (i + 0.5);
    paintText(ctx, ch, x, h * 0.5, { size, color: opts.ink || '#f2ece0', weight: 700, shadow: 3 });
  });
  return canvas;
}

/* 提灯（ちょうちん）：红/白身 + 竖排字 + 竹骨 */
export function lanternJP(chars = '酒', opts = {}) {
  const w = 192; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  const body = opts.body || '#d64b34';
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#8f2a1c'); g.addColorStop(0.32, body); g.addColorStop(0.62, body); g.addColorStop(1, '#8f2a1c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // 竹骨
  ctx.strokeStyle = 'rgba(40,22,14,0.28)'; ctx.lineWidth = 2;
  for (let i = 1; i < 9; i += 1) { ctx.beginPath(); ctx.moveTo(0, (h * i) / 9); ctx.lineTo(w, (h * i) / 9); ctx.stroke(); }
  // 上下木口
  ctx.fillStyle = '#2a1c12'; ctx.fillRect(0, 0, w, h * 0.055); ctx.fillRect(0, h * 0.945, w, h * 0.055);
  // 字
  const list = Array.from(chars);
  const size = Math.min(h * 0.3, (w * 0.7) / Math.max(1, list.length));
  list.forEach((ch, i) => paintText(ctx, ch, w * 0.5, h * (0.5 + (i - (list.length - 1) / 2) * 0.3), { size, color: '#1c1208', weight: 700 }));
  return canvas;
}

/* 木の縦看板：白木底 + 黑字（店名/呑み処） */
export function verticalSignJP(text, opts = {}) {
  const w = 160; const h = 640;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.bg || '#e8dcc0'; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i += 1) {
    ctx.strokeStyle = `rgba(140,118,86,${0.08 + Math.random() * 0.12})`; ctx.lineWidth = 1 + Math.random() * 1.6;
    const y = Math.random() * h;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y + (Math.random() - 0.5) * 6); ctx.stroke();
  }
  ctx.strokeStyle = '#8c6b3f'; ctx.lineWidth = w * 0.06; ctx.strokeRect(w * 0.06, h * 0.02, w * 0.88, h * 0.96);
  const list = Array.from(text);
  const size = w * 0.62;
  const start = h * 0.5 - ((list.length - 1) * size * 1.12) / 2;
  list.forEach((ch, i) => paintText(ctx, ch, w * 0.5, start + i * size * 1.12, { size, color: opts.ink || '#20150c', weight: 700 }));
  return canvas;
}

/* 木のメニュー板（縦書きの品書き） */
export function menuBoardJP(rows, opts = {}) {
  const w = 320; const h = 448;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.bg || '#f0e6cd'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#8c6b3f'; ctx.lineWidth = 8; ctx.strokeRect(10, 10, w - 20, h - 20);
  const size = h * 0.062;
  rows.forEach((row, i) => {
    paintText(ctx, row, w * 0.5, h * 0.16 + i * size * 1.5, { size, color: i === 0 ? '#a63a2b' : '#20150c', weight: 700 });
  });
  return canvas;
}

/* 貼り紙（海报/告示）：白纸 + 红黑字 + 撕角 */
export function posterJP(lines, opts = {}) {
  const w = 256; const h = 352;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.bg || '#efe8d8'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120,104,80,0.5)'; ctx.lineWidth = 3; ctx.strokeRect(6, 6, w - 12, h - 12);
  const size = h * 0.11;
  lines.forEach((line, i) => {
    paintText(ctx, line, w * 0.5, h * 0.2 + i * size * 1.35, { size, color: i === 0 ? '#b0382a' : '#2a2018', weight: 700 });
  });
  return canvas;
}

/* 自動販売機 正面：灯箱面 + 饮料格 + 按钮 */
export function vendingFront() {
  const w = 256; const h = 384;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d9dee6'; ctx.fillRect(0, 0, w, h);
  // 顶部灯箱
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.22);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9fd0ff');
  ctx.fillStyle = g; ctx.fillRect(8, 8, w - 16, h * 0.2);
  paintText(ctx, 'つめたい　あたたかい', w * 0.5, h * 0.14, { size: h * 0.055, color: '#123a6b' });
  // 饮料格
  const cols = 4; const rows = 3;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = 12 + c * ((w - 24) / cols); const y = h * 0.3 + r * h * 0.17;
      ctx.fillStyle = 'rgba(20,24,30,0.85)';
      ctx.fillRect(x + 3, y + 3, (w - 24) / cols - 8, h * 0.13);
      const hues = ['#e05b3c', '#3c7de0', '#e0c23c', '#4bbf7a', '#c94b8f'];
      ctx.fillStyle = hues[(r * cols + c) % hues.length];
      ctx.fillRect(x + 8, y + 10, ((w - 24) / cols - 18) * 0.5, h * 0.09);
      ctx.fillStyle = '#f4f8ff';
      ctx.fillRect(x + 8 + ((w - 24) / cols - 18) * 0.56, y + 10, ((w - 24) / cols - 18) * 0.42, h * 0.09);
    }
  }
  // 取出口 + 按钮
  ctx.fillStyle = '#2a2f36'; ctx.fillRect(20, h * 0.86, w - 40, h * 0.08);
  ctx.fillStyle = '#7fd8ff'; ctx.fillRect(w * 0.12, h * 0.79, w * 0.2, h * 0.035);
  return canvas;
}

/* シャッター（闭店的卷帘门）：波纹金属 + 旧告示 */
export function shutterTexture() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#6b707a'; ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 12) {
    const g = ctx.createLinearGradient(0, y, 0, y + 12);
    g.addColorStop(0, '#8b919c'); g.addColorStop(0.5, '#6b707a'); g.addColorStop(1, '#4d525b');
    ctx.fillStyle = g; ctx.fillRect(0, y, w, 11);
    ctx.fillStyle = 'rgba(20,22,26,0.5)'; ctx.fillRect(0, y + 11, w, 1);
  }
  for (let i = 0; i < 60; i += 1) {
    ctx.fillStyle = `rgba(120,90,60,${0.05 + Math.random() * 0.12})`;
    ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(240,236,226,0.85)'; ctx.fillRect(w * 0.58, h * 0.2, w * 0.3, h * 0.34);
  paintText(ctx, '休', w * 0.73, h * 0.3, { size: h * 0.12, color: '#b0382a' });
  paintText(ctx, '業中', w * 0.73, h * 0.44, { size: h * 0.1, color: '#b0382a' });
  return canvas;
}

/* 幟（のぼり）：白布 + 红黑竖排字 */
export function noboriTexture(text, opts = {}) {
  const w = 160; const h = 640;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.bg || '#f3efe4'; ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.06)'); g.addColorStop(0.5, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = opts.band || '#b0382a'; ctx.fillRect(0, 0, w, h * 0.07);
  const list = Array.from(text);
  const size = w * 0.6;
  const start = h * 0.14 + size * 0.6;
  list.forEach((ch, i) => paintText(ctx, ch, w * 0.5, start + i * size * 1.08, { size, color: opts.ink || '#1c1a18', weight: 700 }));
  return canvas;
}

/* 立て看板（A字黑板）：木框 + 手写粉笔字 */
export function aframeTexture(rows) {
  const w = 320; const h = 448;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#6a4a2e'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#1d2622'; ctx.fillRect(16, 16, w - 32, h - 32);
  ctx.strokeStyle = 'rgba(240,236,226,0.85)'; ctx.lineWidth = 3; ctx.strokeRect(26, 26, w - 52, h - 52);
  const size = h * 0.085;
  rows.forEach((row, i) => paintText(ctx, row, w * 0.5, h * 0.24 + i * size * 1.4, { size, color: i === 0 ? '#ffe9a8' : '#f2ece0' }));
  return canvas;
}

/* 遠景のビル窓（灯り） */
export function buildingWindows() {
  const w = 256; const h = 256;
  const canvas = cv(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#141a25'; ctx.fillRect(0, 0, w, h);
  const cols = 8; const rows = 12;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const on = Math.random() < 0.42;
      ctx.fillStyle = on ? `rgba(255,${190 + Math.random() * 50 | 0},${120 + Math.random() * 60 | 0},${0.5 + Math.random() * 0.45})` : 'rgba(30,38,52,0.9)';
      ctx.fillRect(c * (w / cols) + 4, r * (h / rows) + 5, w / cols - 9, h / rows - 10);
    }
  }
  return canvas;
}
