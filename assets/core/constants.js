/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */

import * as THREE from 'three';
import { W } from './world.js';

/* LAYER_OUTLINED（core/constants） */
export const LAYER_OUTLINED = 0;

/* LAYER_PLAIN（core/constants） */
export const LAYER_PLAIN = 1;

/* LAYER_GROUND（core/constants） */
export const LAYER_GROUND = 2;

/* LAYER_EFFECTS（core/constants） */
export const LAYER_EFFECTS = 3;

/* CHANNEL（core/constants） */
export const CHANNEL = {
  alleyLamp: 11,
  doorSensor: 13,
  hangingSign: 14,
  interiorLights: 4,
  neighborTv: 15,
  poleSign: 2,
  poleSignSub: 3,
  securityLight: 12,
  signalGreen: 6,
  signalRed: 8,
  signalYellow: 7,
  steady: 0,
  storeSign: 1,
  vending: 5,
  walkGreen: 9,
  walkRed: 10,
}

/* FACE（core/constants） */
export const FACE = { nx: 1, ny: 3, nz: 5, px: 0, py: 2, pz: 4 }

/* LOT_Y（core/constants） */
export const LOT_Y = 0.15;

/* FLOOR_Y（core/constants） */
export const FLOOR_Y = 0.25;

/* BRAND（core/constants） */
export const BRAND = { coral: '#ff7b67', cream: '#fbf9f1', lemon: '#ffd449', navy: '#1f2d5c', sky: '#3ba6e6' }

/* FONT_DISPLAY（core/constants） */
export const FONT_DISPLAY = '"Dela Gothic One", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif';

/* FONT_ROUNDED（core/constants） */
export const FONT_ROUNDED = '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif';

/* FONT_HAND（core/constants） */
export const FONT_HAND = '"Yusei Magic", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", sans-serif';

/* FONT_PLAIN（core/constants） */
export const FONT_PLAIN = '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", "Helvetica Neue", Arial, sans-serif';

/* TEXT_SAMPLE（core/constants） */
export const TEXT_SAMPLE = [
  'ほしぞらマート HOSHIZORA MART OPEN 24 HOURS ほしぞら MART 24H ATM P',
  'こちらにお並びください 足元注意 すべりやすい いらっしゃいませ WELCOME',
  'ポテト チップス えびせん チョコ クッキー ラムネ グミ おかき のり塩 コンソメ うすしお ビスケット キャンディ せんべい ようかん ガム',
  'カップめん うどん そば しお みそ しょうゆ カレー とんこつ シャンプー ティッシュ 電池 洗剤 マスク タオル ハブラシ',
  '週刊ほしぞら NEKO 雨の旅 ごはん MUSIC ゲーム 月刊マンガ くらし スポーツ すてき 天気 カメラ',
  'お茶 水 SODA COFFEE つめた～いドリンク COLD DRINKS 鮭 梅 昆布 ツナ 明太 おかか たまご ハム',
  'お弁当・おにぎり お菓子 日用品 アイス レジ パン お弁当・おにぎり・サンドイッチ',
  'おでん 全品70円 肉まん あんまん ピザまん 新発売 いちごミルク ホットコーヒー 100円 150円 180円 110円',
  'スイーツフェア 雨の日 ポイント2倍 マンガ新刊 入荷しました 夏祭り',
  'つめた～い あったか～い 130 160 おつり とりだし口 COLD & HOT',
  'TOBACCO ホットスナック からあげ コロッケ 中華まん HOT COFFEE ICED COFFEE カフェラテ',
  'お引き出し コピー STAFF ONLY 関係者以外立入禁止 ほしの歯科 この先200m つきみ不動産 星見町2丁目 星見町 2-14',
  '止まれ STOP 星見通り Hoshimi-dori 町内会のお知らせ 秋祭り 迷い猫 さがしています 防災訓練 ゴミ出しルール 回覧板',
  'ほしみ文具店 本日休業 アイスクリーム ICE 自動ドア OPEN 24H Free Wi-Fi イートイン',
  'もえるゴミ かん・びん ペットボトル あきかん リサイクル かさ袋 雨宿りの街角 RAINY NIGHT KONBINI 1:150',
  '新商品! おすすめ 期間限定 今だけ 0123456789 円 R L',
].join(' ');

/* GLASS_VERTEX_SHADER（core/constants） */
export const GLASS_VERTEX_SHADER = /* glsl */`
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

/* GLASS_FRAGMENT_SHADER（core/constants） */
export const GLASS_FRAGMENT_SHADER = /* glsl */`
  uniform float uTime;
  uniform float uRain;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  float hashOne(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec3 hashThree(float point) {
    vec3 value = fract(vec3(point) * vec3(0.1031, 0.11369, 0.13787));
    value += dot(value, value.yzx + 19.19);
    return fract(vec3((value.x + value.y) * value.z, (value.x + value.z) * value.y, (value.y + value.z) * value.x));
  }

  // x: droplet body, y: wet trail left behind
  vec2 computeSlidingDrops(vec2 glassPosition, float time) {
    vec2 cellSize = vec2(0.19, 0.85);
    vec2 scaled = glassPosition / cellSize;
    float column = floor(scaled.x);
    scaled.y += hashOne(vec2(column, 7.0)) * 5.0;
    vec2 cell = floor(scaled);
    vec2 local = fract(scaled);
    vec3 randomValues = hashThree(cell.x * 35.2 + cell.y * 2376.1);
    float speed = 0.16 + randomValues.x * 0.22;
    float cycle = fract(time * speed + randomValues.y);
    float dropY = 1.0 - cycle + sin(cycle * 23.0 + randomValues.z * 6.0) * 0.012;
    float dropX = 0.5 + (randomValues.z - 0.5) * 0.55 + sin(local.y * 9.0 + randomValues.z * 6.28) * 0.05;
    vec2 delta = (local - vec2(dropX, dropY)) * cellSize;
    float radius = 0.016 + randomValues.x * 0.012;
    float drop = smoothstep(radius, radius * 0.35, length(delta * vec2(1.0, 0.8)));
    float trailWidth = smoothstep(radius * 0.55, 0.0, abs(delta.x));
    float trail = trailWidth * step(dropY, local.y) * smoothstep(1.0, 0.0, (local.y - dropY) * 1.5);
    float existence = smoothstep(0.0, 0.05, cycle) * smoothstep(1.0, 0.9, cycle);
    return vec2(drop, trail) * existence;
  }

  float computeStaticDrops(vec2 glassPosition, float time) {
    vec2 scaled = glassPosition * 24.0;
    vec2 cell = floor(scaled);
    vec2 local = fract(scaled) - 0.5;
    vec3 randomValues = hashThree(cell.x * 71.3 + cell.y * 913.7);
    vec2 offset = (randomValues.xy - 0.5) * 0.6;
    float lifetime = fract(time * 0.12 + randomValues.z);
    float size = 0.2 * smoothstep(0.0, 0.2, lifetime) * smoothstep(1.0, 0.6, lifetime) * step(0.5, randomValues.z);
    return smoothstep(size, size * 0.4, length(local - offset));
  }

  void main() {
    vec3 normalDirection = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    if (dot(normalDirection, viewDirection) < 0.0) {
      normalDirection = -normalDirection;
    }
    float facing = clamp(dot(normalDirection, viewDirection), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 4.0);
    bool isHorizontal = abs(normalDirection.y) > 0.9;
    vec3 tangent = isHorizontal ? vec3(1.0, 0.0, 0.0) : normalize(cross(vec3(0.0, 1.0, 0.0), normalDirection));
    vec2 glassPosition = isHorizontal ? vWorldPosition.xz : vec2(dot(vWorldPosition, tangent), vWorldPosition.y);
    vec3 reflected = reflect(-viewDirection, normalDirection);
    vec3 sky = mix(vec3(0.012, 0.016, 0.035), vec3(0.07, 0.09, 0.17), smoothstep(-0.2, 0.7, reflected.y));
    float diagonal = glassPosition.x * 0.8 - glassPosition.y * 0.55;
    float highlight = smoothstep(0.965, 0.992, sin(diagonal * 3.1)) + 0.5 * smoothstep(0.985, 0.997, sin(diagonal * 3.1 + 0.9));
    vec3 color = sky * (0.3 + 0.7 * fresnel) + vec3(0.55, 0.68, 0.85) * highlight * 0.05;
    float alpha = 0.05 + 0.5 * fresnel + highlight * 0.035;
    float distanceFade = smoothstep(42.0, 14.0, distance(cameraPosition, vWorldPosition));
    vec2 sliding = computeSlidingDrops(glassPosition, uTime) * uRain;
    float stationary = computeStaticDrops(glassPosition, uTime) * uRain * distanceFade;
    float dropMask = max(sliding.x, stationary);
    color += vec3(0.8, 0.86, 0.98) * dropMask * 0.22 + vec3(0.6, 0.7, 0.85) * sliding.y * 0.035;
    alpha += dropMask * 0.3 + sliding.y * 0.06;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.9));
  }
`;

/* PANEL_ROTATIONS（core/constants） */
export const PANEL_ROTATIONS = {
  '+x': [0, Math.PI / 2, 0],
  '+y': [-Math.PI / 2, 0, 0],
  '+z': [0, 0, 0],
  '-x': [0, -Math.PI / 2, 0],
  '-y': [Math.PI / 2, 0, 0],
  '-z': [0, Math.PI, 0],
}

/* PACKAGE_PALETTE（core/constants） */
export const PACKAGE_PALETTE = ['#e84a3c', '#f29e38', '#f6cf45', '#63b75b', '#3a8fd9', '#8e5bc4', '#ee7fae', '#ef6a2a', '#27b3ac', '#d23a5f', '#4a5bd1', '#9bc53d', '#f4efe3', '#2d3a4a', '#c0392b', '#1f9e89'];

/* PACKAGE_WORDS（core/constants） */
export const PACKAGE_WORDS = [
  ['ポテト', 'チップス', 'えびせん', 'のり塩', 'コンソメ', 'うすしお', 'おかき', 'せんべい', 'ポテト', 'チップス', 'えびせん', 'のり塩', 'コンソメ', 'うすしお', 'おかき', 'せんべい'],
  ['チョコ', 'クッキー', 'ビスケット', 'ラムネ', 'グミ', 'キャンディ', 'ガム', 'ようかん', 'チョコ', 'クッキー', 'ビスケット', 'ラムネ', 'グミ', 'キャンディ', 'ガム', 'ようかん'],
  ['シャンプー', 'ティッシュ', '電池', '洗剤', 'マスク', 'タオル', 'ハブラシ', 'お茶', 'シャンプー', 'ティッシュ', '電池', '洗剤', 'マスク', 'タオル', 'ハブラシ', 'お茶'],
  ['うどん', 'そば', 'しお', 'みそ', 'しょうゆ', 'カレー', 'とんこつ', 'カップめん', 'うどん', 'そば', 'しお', 'みそ', 'しょうゆ', 'カレー', 'とんこつ', 'カップめん'],
];

/* PACKAGE_COLUMNS（core/constants） */
export const PACKAGE_COLUMNS = 16;

/* PACKAGE_ROWS（core/constants） */
export const PACKAGE_ROWS = 4;

/* MAGAZINE_TITLES（core/constants） */
export const MAGAZINE_TITLES = ['週刊ほしぞら', 'NEKO', '雨の旅', 'ごはん', 'MUSIC', 'ゲーム', '月刊マンガ', 'くらし', 'スポーツ', 'すてき', '天気', 'カメラ'];

/* BOTTLE_KINDS（core/constants） */
export const BOTTLE_KINDS = [
  { colors: ['#6f8f3a', '#8a6a2f', '#5d7d2a', '#a0782f', '#4f7a3c'], isCan: false },
  { colors: ['#bfe3f5', '#a8d8f0', '#d2eef9', '#9fd0ec'], isCan: false },
  { colors: ['#f24b3a', '#ff9f1c', '#8e5bc4', '#2ec27e', '#f06292', '#ffd449'], isCan: false },
  { colors: ['#2d2a26', '#b07a3a', '#1f2d5c', '#c0392b', '#e8e2d0'], isCan: true },
];

/* CATEGORY_SIGNS（core/constants） */
export const CATEGORY_SIGNS = [
  { color: '#f08a3c', text: 'お弁当・おにぎり' },
  { color: '#ef6f9c', text: 'お菓子' },
  { color: '#46a96b', text: '日用品' },
  { color: '#3f8fe0', text: 'アイス' },
  { color: '#1f2d5c', text: 'レジ' },
  { color: '#e9b53a', text: 'パン' },
];

/* GROUND_SIZE（core/constants） */
export const GROUND_SIZE = 2048;

/* GROUND_SCALE（core/constants） */
export const GROUND_SCALE = GROUND_SIZE / 24;

/* WET_SIZE（core/constants） */
export const WET_SIZE = 1024;

/* WET_SCALE（core/constants） */
export const WET_SCALE = WET_SIZE / 24;

/* PUDDLES（core/constants） */
export const PUDDLES = [
  { depth: 1.0, strength: 1.0, width: 1.8, x: -2.2, z: 2.1 },
  { depth: 0.8, strength: 0.9, width: 1.1, x: 0.5, z: 1.3 },
  { depth: 0.5, strength: 0.8, width: 0.7, x: 2.8, z: 3.2 },
  { depth: 0.55, strength: 0.9, width: 2.8, x: -6.6, z: 6.2 },
  { depth: 0.9, strength: 1.0, width: 1.7, x: -1.4, z: 7.5 },
  { depth: 0.5, strength: 0.85, width: 2.4, x: -9.0, z: 10.05 },
  { depth: 1.5, strength: 1.0, width: 2.4, x: 8.4, z: 7.6 },
  { depth: 2.0, strength: 1.0, width: 1.1, x: 7.1, z: -3.4 },
  { depth: 1.0, strength: 0.9, width: 0.9, x: 9.7, z: -9.0 },
  { depth: 0.7, strength: 0.7, width: 0.5, x: 4.7, z: -1.9 },
  { depth: 2.6, strength: 0.9, width: 0.8, x: -6.25, z: -4.6 },
  { depth: 0.9, strength: 0.9, width: 1.3, x: -9.8, z: 1.2 },
  { depth: 0.8, strength: 0.8, width: 1.4, x: -1.5, z: -10.2 },
  { depth: 0.6, strength: 0.8, width: 0.9, x: 11.2, z: 8.3 },
  { depth: 0.4, strength: 0.7, width: 0.9, x: -3.0, z: 11.2 },
  { depth: 0.6, strength: 1.0, width: 0.6, x: -5.3, z: 0.75 },
  { depth: 0.8, strength: 0.9, width: 1.2, x: 3.2, z: 8.8 },
  { depth: 1.2, strength: 0.9, width: 0.7, x: 6.2, z: 2.6 },
];

/* GROUND_FRAGMENT_HEADER（core/constants） */
export const GROUND_FRAGMENT_HEADER = /* glsl */`
  uniform sampler2D uReflectionMap;
  uniform mat4 uReflectionMatrix;
  uniform sampler2D uWetMap;
  uniform float uTime;
  varying vec3 vGroundWorld;

  vec2 hashTwo(vec2 point) {
    vec3 value = fract(vec3(point.xyx) * vec3(0.1031, 0.1030, 0.0973));
    value += dot(value, value.yzx + 33.33);
    return fract((value.xx + value.yz) * value.zy);
  }

  vec2 computeRippleOffset(vec2 position, float time) {
    vec2 total = vec2(0.0);
    for (int layer = 0; layer < 2; layer++) {
      float scale = layer == 0 ? 1.7 : 2.9;
      vec2 scaled = position * scale + float(layer) * 13.7;
      vec2 cell = floor(scaled);
      for (int offsetY = -1; offsetY <= 1; offsetY++) {
        for (int offsetX = -1; offsetX <= 1; offsetX++) {
          vec2 neighbor = cell + vec2(float(offsetX), float(offsetY));
          vec2 randomPair = hashTwo(neighbor);
          float period = 0.9 + randomPair.x * 0.8;
          float phase = fract(time / period + randomPair.y);
          vec2 center = neighbor + 0.15 + 0.7 * hashTwo(neighbor + 11.3);
          vec2 delta = scaled - center;
          float distanceToCenter = length(delta);
          float ring = distanceToCenter - phase * 0.85;
          float envelope = (1.0 - phase) * (1.0 - phase) * smoothstep(0.16, 0.0, abs(ring));
          total += delta / max(distanceToCenter, 0.001) * sin(ring * 34.0) * envelope;
        }
      }
    }
    return total * 0.5;
  }
`;

/* GROUND_FRAGMENT_BODY（core/constants） */
export const GROUND_FRAGMENT_BODY = /* glsl */`
  {
    vec2 wetUv = vec2((vGroundWorld.x + 12.0) / 24.0, 1.0 - (vGroundWorld.z + 12.0) / 24.0);
    vec4 wetSample = texture2D(uWetMap, wetUv);
    float puddle = smoothstep(0.4, 0.6, wetSample.r);
    float wetness = 0.55 + 0.45 * wetSample.g;
    float gutterFlow = wetSample.b;
    float paint = smoothstep(0.3, 0.55, dot(diffuseColor.rgb, vec3(0.3333)));
    vec2 ripple = computeRippleOffset(vGroundWorld.xz, uTime) * (0.3 + 0.7 * puddle);
    vec2 flowDirection = vGroundWorld.z > 5.4 ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    float flowPhase = dot(vGroundWorld.xz, flowDirection) * 9.0 - uTime * 5.5;
    float crossPhase = dot(vGroundWorld.xz, vec2(-flowDirection.y, flowDirection.x)) * 23.0;
    ripple += flowDirection * sin(flowPhase + sin(crossPhase) * 1.7) * 0.45 * gutterFlow;
    vec3 viewVector = normalize(cameraPosition - vGroundWorld);
    float grazing = 1.0 - clamp(viewVector.y, 0.0, 1.0);
    float fresnel = 0.35 + 0.65 * pow(grazing, 2.5);
    vec4 projected = uReflectionMatrix * vec4(vGroundWorld.x, 0.0, vGroundWorld.z, 1.0);
    vec2 reflectionUv = projected.xy / projected.w + ripple * mix(0.006, 0.02, puddle);
    // 真实石面/沥青法线（CC0 PavingStones131）扰动反射：水面镜像被表面起伏打散，湿地才有颗粒感
    #ifdef USE_NORMALMAP
      vec2 slope = texture2D(normalMap, vNormalMapUv).xy - 0.5;
      reflectionUv += slope * mix(0.03, 0.006, puddle);
    #endif
    float roughness = (1.0 - puddle) * (1.0 - 0.45 * paint);
    // 亮处的石材更有纹理 → 更粗糙，暗处沥青更亮面：打破整片镜面的塑料感
    #ifdef USE_NORMALMAP
      roughness = mix(roughness, 1.0, smoothstep(0.04, 0.3, dot(diffuseColor.rgb, vec3(0.3333))) * 0.4);
    #endif
    float lod = roughness * 1.15;
    vec3 reflection = textureLod(uReflectionMap, reflectionUv, lod).rgb;
    vec3 streak = reflection;
    for (int tap = 1; tap <= 4; tap++) {
      float offset = float(tap) * 0.011 * roughness;
      streak += textureLod(uReflectionMap, reflectionUv + vec2(0.0, offset), lod + 0.5).rgb;
      streak += textureLod(uReflectionMap, reflectionUv - vec2(0.0, offset * 0.6), lod + 0.5).rgb;
    }
    reflection = mix(streak / 9.0, reflection, puddle);
    float reflectivity = mix(0.58 * wetness, 1.05, puddle) * fresnel;
    outgoingLight *= mix(0.9, 0.34, puddle);
    outgoingLight += reflection * reflectivity + diffuseColor.rgb * paint * 0.035;
  }
`;

/* COLORS（core/constants） */
export const COLORS = {
  aluminum: '#a7aeb7',
  concrete: '#9a9da4',
  darkTrim: '#393e47',
  exteriorWall: '#cfd2d8',
  interiorWall: '#f3ecdf',
  metal: '#5b616b',
  pole: '#8c939e',
  silver: '#c8cdd3',
}

/* SHRUB_COLORS（core/constants） */
export const SHRUB_COLORS = ['#2f5d3a', '#3b6d44', '#285036', '#355f3c'];

/* HYDRANGEA_COLORS（core/constants） */
export const HYDRANGEA_COLORS = ['#6f8fe0', '#9a7fd6', '#7aa7e8', '#c48fd0', '#5f7fd8'];

/* PRODUCT_CATEGORIES（core/constants） */
export const PRODUCT_CATEGORIES = {
  boxes: { depth: [0.05, 0.08], height: [0.1, 0.19], row: 1, width: [0.09, 0.15] },
  cups: { depth: [0.11, 0.11], height: [0.1, 0.12], isCylinder: true, row: 3, width: [0.11, 0.12] },
  daily: { depth: [0.06, 0.1], height: [0.12, 0.25], row: 2, width: [0.07, 0.12] },
  snacks: { depth: [0.06, 0.1], height: [0.18, 0.26], row: 0, width: [0.14, 0.2] },
}

/* SIGNAL_COLORS（core/constants） */
export const SIGNAL_COLORS = {
  green: new THREE.Color(0x2de0b8),
  red: new THREE.Color(0xff3b3b),
  yellow: new THREE.Color(0xffc233),
}

/* LIGHT_TINT_CHUNK（core/constants） */
export const LIGHT_TINT_CHUNK = /* glsl */`
  uniform vec4 uLightSpheres[7];
  uniform vec3 uLightColors[7];
  vec3 computeLightTint(vec3 point, vec3 baseTint) {
    vec3 tint = baseTint;
    for (int index = 0; index < 7; index++) {
      float influence = 1.0 - smoothstep(0.0, uLightSpheres[index].w, distance(point, uLightSpheres[index].xyz));
      tint += uLightColors[index] * influence * influence;
    }
    return tint;
  }
`;

/* SPLASH_COUNT（core/constants） */
export const SPLASH_COUNT = 900;

/* SPLASH_EXTRA（core/constants） */
export const SPLASH_EXTRA = 96;

/* SPLASH_LIFE（core/constants） */
export const SPLASH_LIFE = 0.32;

/* SPLASH_SURFACES（core/constants） */
export const SPLASH_SURFACES = [
  { maxX: 12, maxZ: 10.6, minX: -12, minZ: 5.6, y: 0.0 },
  { maxX: 10.6, maxZ: 5.6, minX: 5.6, minZ: -12, y: 0.0 },
  { maxX: 5.6, maxZ: 5.6, minX: -12, minZ: 3.8, y: LOT_Y },
  { maxX: 5.6, maxZ: 3.8, minX: 4.62, minZ: -12, y: LOT_Y },
  { maxX: 3.8, maxZ: 3.8, minX: -12, minZ: 0.45, y: LOT_Y },
  { maxX: -5.3, maxZ: 0.45, minX: -6.95, minZ: -11.6, y: LOT_Y },
  { maxX: -7.3, maxZ: 0.45, minX: -12, minZ: -1.6, y: LOT_Y },
  { maxX: 3.7, maxZ: -8.6, minX: -5.2, minZ: -11.6, y: LOT_Y },
  { maxX: 12, maxZ: 11.45, minX: -12, minZ: 10.6, y: LOT_Y },
  { maxX: 11.45, maxZ: 4.8, minX: 10.6, minZ: -12, y: LOT_Y },
  { maxX: 3.6, maxZ: -1.2, minX: -5.0, minZ: -7.8, y: 3.56 },
  { maxX: 3.9, maxZ: 0.33, minX: -5.3, minZ: -0.98, y: 2.99 },
];

/* FULLSCREEN_VERTEX_SHADER（core/constants） */
export const FULLSCREEN_VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* FONT_STYLESHEETS（core/constants） */
export const FONT_STYLESHEETS = [
  'https://registry.npmmirror.com/@fontsource/dela-gothic-one/5.3.0/files/400.css',
  'https://registry.npmmirror.com/@fontsource/m-plus-rounded-1c/5.3.0/files/800.css',
  'https://registry.npmmirror.com/@fontsource/yusei-magic/5.3.0/files/400.css',
];
