/* photos —— 真实素材（CC0）的加载与取用
   2026-10-15 新增。素材来源与校验和见 assets.lock.json（Poly Haven / ambientCG，CC0），
   本体在 assets/hdri、assets/textures（不进仓库；node scripts/fetch-assets.mjs 复原）。

   用途：把原先「用 canvas 程序化画出来」的地面/铁篦换成真实素材照片。
   口径：观感优先 —— 缺素材不致命，调用方自动回退到程序化画法。 */

export const photos = {};

/* 素材开关：默认关（默认观感＝原版程序化画法）；地址栏加 ?photos=1 才启用，离线对照时用 */
export function photosEnabled() {
  return typeof location !== 'undefined' && /[?&]photos=1/.test(location.search);
}

const ROOTED = (file) => [`assets/textures/${file}`, `../assets/textures/${file}`];

const SOURCES = {
  paving: ROOTED('paving/PavingStones131_1K-JPG_Color.jpg'),
  pavingNormal: ROOTED('paving/PavingStones131_1K-JPG_NormalGL.jpg'),
  asphalt: ROOTED('asphalt/Asphalt033_1K-JPG_Color.jpg'),
  metal: ROOTED('metal/Metal032_1K-JPG_Color.jpg'),
};

/* 一张铺装贴图在贴图空间里占多少像素（= 2.4 世界单位，见 PAVING_NORMAL_REPEAT） */
export const PAVING_TILE_PX = 205;
export const ASPHALT_TILE_PX = 205;
export const PAVING_NORMAL_REPEAT = 10; // 地面 UV 是 0..1 覆盖 24 单位 → 一张贴图 2.4 单位

function loadImage(urls) {
  const candidates = Array.isArray(urls) ? urls : [urls];
  return new Promise((resolve) => {
    const tryNext = (index) => {
      if (index >= candidates.length) { resolve(null); return; }
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => tryNext(index + 1);
      image.src = candidates[index];
    };
    tryNext(0);
  });
}

export async function loadPhotos() {
  // 默认关闭：观感对照实测「接素材」与程序化无肉眼差别，却多 5.6MB 下载 —— 改成显式开关，地址栏加 ?photos=1 才启用
  if (!photosEnabled()) {
    if (typeof console !== 'undefined') console.warn('[photos] 未启用（默认关；需要时加 ?photos=1）');
    return photos;
  }
  const loaded = await Promise.all(
    Object.entries(SOURCES).map(async ([key, url]) => [key, await loadImage(url)]),
  );
  for (const [key, image] of loaded) if (image) photos[key] = image;
  if (typeof window !== 'undefined') window.__photos = photos; // 诊断探针
  if (typeof console !== 'undefined') console.warn('[photos] 载入', Object.keys(photos).join(',') || '(无)');
  return photos;
}

/* 在 canvas 的指定矩形里平铺画一张照片；tilePx = 一张贴图占多少像素 */
export function drawPhotoTiled(context, image, x, y, width, height, tilePx) {
  if (!image || width <= 0 || height <= 0) return false;
  const pattern = context.createPattern(image, 'repeat');
  if (!pattern) return false;
  const scale = tilePx / image.width;
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  context.translate(x, y);
  context.scale(scale, scale);
  context.fillStyle = pattern;
  context.fillRect(0, 0, width / scale, height / scale);
  context.restore();
  return true;
}
