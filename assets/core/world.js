/* 世界与运行时状态（基准里会被跨模块改写的绑定都集中在这里，写法 W.名字，与基准同名）。
   资产件只通过 W 读写这些状态：ES 模块的具名导入是只读的，不能跨模块赋值。 */

export const W = {};

import * as THREE from 'three';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createGradientTexture } from './canvas.js';
import {
  FULLSCREEN_VERTEX_SHADER,
  LAYER_OUTLINED,
  LAYER_PLAIN,
  PACKAGE_COLUMNS,
  PACKAGE_PALETTE,
  PACKAGE_ROWS,
} from './constants.js';
import { GeometryBucket } from './geometry.js';
import { TextureAtlas, packageColors, reflectionCamera } from './util.js';

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* canvasElement（运行时状态，挂在 W 上） */
W.canvasElement = document.getElementById('scene');;

/* renderer（运行时状态，挂在 W 上） */
W.renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas: W.canvasElement,
  powerPreference: 'high-performance',
  stencil: false,
});;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.setClearColor(0x000000, 1);

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.toneMapping = THREE.ACESFilmicToneMapping;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.toneMappingExposure = 1.1;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.shadowMap.enabled = true;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.renderer.shadowMap.autoUpdate = false;

/* hasFloatBuffers（运行时状态，挂在 W 上） */
W.hasFloatBuffers = W.renderer.extensions.has('EXT_color_buffer_float');;

/* hdrType（运行时状态，挂在 W 上） */
W.hdrType = W.hasFloatBuffers ? THREE.HalfFloatType : THREE.UnsignedByteType;;

/* scene（运行时状态，挂在 W 上） */
W.scene = new THREE.Scene();;

/* backgroundColor（运行时状态，挂在 W 上） */
W.backgroundColor = new THREE.Color(0.006, 0.008, 0.018);;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.scene.background = W.backgroundColor;

/* camera（运行时状态，挂在 W 上） */
W.camera = new THREE.PerspectiveCamera(28, 1, 0.5, 320);;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.camera.layers.enableAll();

/* controls（运行时状态，挂在 W 上） */
W.controls = new OrbitControls(W.camera, W.canvasElement);;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.enableDamping = true;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.dampingFactor = 0.075;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.rotateSpeed = 0.55;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.zoomSpeed = 0.9;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.panSpeed = 0.6;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.minDistance = 10;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.maxDistance = 105;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.minPolarAngle = 0.1;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.maxPolarAngle = 1.52;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.cursor.set(0, 0.9, -0.4);

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.maxTargetRadius = 8;

/* ── 顶层语句（世界/控制/事件/启动）── */
W.controls.target.set(0, 0.9, -0.4);

/* sharedUniforms（运行时状态，挂在 W 上） */
W.sharedUniforms = {
  uChannelLevels: { value: new Float32Array(16).fill(1) },
  uInteriorTint: { value: new THREE.Color(1.0, 0.88, 0.72) },
  uTime: { value: 0 },
};

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* atlas（运行时状态，挂在 W 上） */
W.atlas = new TextureAtlas(4096, 4096);;

/* atlasRects（运行时状态，挂在 W 上） */
W.atlasRects = {};

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* whiteRect（运行时状态，挂在 W 上） */
W.whiteRect = W.atlas.register(8, 8, (context, width, height) => {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
});;

/* groundGradient（运行时状态，挂在 W 上） */
W.groundGradient = createGradientTexture(Array.from({ length: 32 }, (unused, index) => {
  const coordinate = (index + 0.5) / 32;
  return 0.06 * coordinate + 0.94 * Math.pow(Math.max(0, coordinate * 2 - 1), 0.85);
}), THREE.LinearFilter);;

/* scratchPosition（运行时状态，挂在 W 上） */
W.scratchPosition = new THREE.Vector3();;

/* scratchNormal（运行时状态，挂在 W 上） */
W.scratchNormal = new THREE.Vector3();;

/* scratchNormalMatrix（运行时状态，挂在 W 上） */
W.scratchNormalMatrix = new THREE.Matrix3();;

/* Y_AXIS（运行时状态，挂在 W 上） */
W.Y_AXIS = new THREE.Vector3(0, 1, 0);;

/* defaultInterior（运行时状态，挂在 W 上） */
W.defaultInterior = 0;;

/* buckets（运行时状态，挂在 W 上） */
W.buckets = {
  cutout: new GeometryBucket(),
  exteriorGlass: new GeometryBucket(),
  interiorGlass: new GeometryBucket(),
  outlined: new GeometryBucket(),
  plain: new GeometryBucket(),
};

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* transformStack（运行时状态，挂在 W 上） */
W.transformStack = [new THREE.Matrix4()];;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
for (let row = 0; row < PACKAGE_ROWS; row += 1) {
  for (let column = 0; column < PACKAGE_COLUMNS; column += 1) {
    packageColors.push(row === 3 ? '#f6f2e8' : PACKAGE_PALETTE[(column * 5 + row * 3) % PACKAGE_PALETTE.length]);
  }
}

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* fans（运行时状态，挂在 W 上） */
W.fans = [];;

/* materials（运行时状态，挂在 W 上） */
W.materials = null;;

/* catTail（运行时状态，挂在 W 上） */
W.catTail = null;;

/* catTailBaseRotation（运行时状态，挂在 W 上） */
W.catTailBaseRotation = 0;;

/* door（运行时状态，挂在 W 上） */
W.door = { leftPanel: null, openAmount: 0, phase: 'closed', rightPanel: null, timer: 4 };

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* lights（运行时状态，挂在 W 上） */
W.lights = {};

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* splashState（运行时状态，挂在 W 上） */
W.splashState = { attribute: null, cumulativeWeights: [], data: null, nextExtraSlot: 0, totalWeight: 0 };

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* dripState（运行时状态，挂在 W 上） */
W.dripState = { attribute: null, data: null, stretch: null, stretchAttribute: null };

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* overflowStream（运行时状态，挂在 W 上） */
W.overflowStream = { lastSplash: 0, x: 3.9, z: 0.43 };

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* sceneTarget（运行时状态，挂在 W 上） */
W.sceneTarget = new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: W.hdrType });;

/* normalTarget（运行时状态，挂在 W 上） */
W.normalTarget = new THREE.WebGLRenderTarget(1, 1, {
  depthTexture: new THREE.DepthTexture(1, 1),
  magFilter: THREE.NearestFilter,
  minFilter: THREE.NearestFilter,
});;

/* compositeTarget（运行时状态，挂在 W 上） */
W.compositeTarget = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, type: W.hdrType });;

/* gradeTarget（运行时状态，挂在 W 上） */
W.gradeTarget = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });;

/* reflectionTarget（运行时状态，挂在 W 上） */
W.reflectionTarget = new THREE.WebGLRenderTarget(1, 1, {
  generateMipmaps: true,
  magFilter: THREE.LinearFilter,
  minFilter: THREE.LinearMipmapLinearFilter,
  type: W.hdrType,
});;

/* ── 顶层语句（世界/控制/事件/启动）── */
reflectionCamera.layers.set(LAYER_OUTLINED);

/* ── 顶层语句（世界/控制/事件/启动）── */
reflectionCamera.layers.enable(LAYER_PLAIN);

/* normalClearColor（运行时状态，挂在 W 上） */
W.normalClearColor = new THREE.Color(0.5, 0.5, 1.0);;

/* blackColor（运行时状态，挂在 W 上） */
W.blackColor = new THREE.Color(0, 0, 0);;

/* backgroundTexture（运行时状态，挂在 W 上） */
W.backgroundTexture = null;;

/* normalPassMaterial（运行时状态，挂在 W 上） */
W.normalPassMaterial = new THREE.ShaderMaterial({
  fragmentShader: /* glsl */`
    varying vec3 vViewNormal;
    void main() {
      vec3 viewNormal = normalize(vViewNormal);
      if (!gl_FrontFacing) {
        viewNormal = -viewNormal;
      }
      gl_FragColor = vec4(viewNormal * 0.5 + 0.5, 1.0);
    }
  `,
  side: THREE.DoubleSide,
  vertexShader: /* glsl */`
    varying vec3 vViewNormal;
    void main() {
      vec3 objectNormal = normal;
      vec4 localPosition = vec4(position, 1.0);
      #ifdef USE_INSTANCING
        localPosition = instanceMatrix * localPosition;
        objectNormal = mat3(instanceMatrix) * objectNormal;
      #endif
      vViewNormal = normalize(normalMatrix * objectNormal);
      gl_Position = projectionMatrix * modelViewMatrix * localPosition;
    }
  `,
});;

/* compositeMaterial（运行时状态，挂在 W 上） */
W.compositeMaterial = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  fragmentShader: /* glsl */`
    #include <packing>
    uniform sampler2D tColor;
    uniform sampler2D tNormal;
    uniform sampler2D tDepth;
    uniform vec2 uResolution;
    uniform float uCameraNear;
    uniform float uCameraFar;
    uniform float uLineWidth;
    uniform vec3 uInkColor;
    varying vec2 vUv;

    float readViewDepth(vec2 uv) {
      float depth = texture2D(tDepth, uv).x;
      return -perspectiveDepthToViewZ(depth, uCameraNear, uCameraFar);
    }

    vec3 readNormal(vec2 uv) {
      return texture2D(tNormal, uv).xyz * 2.0 - 1.0;
    }

    void main() {
      vec4 baseColor = max(texture2D(tColor, vUv), vec4(0.0));
      vec2 texel = uLineWidth / uResolution;
      float depthCenter = readViewDepth(vUv);
      float depthLeft = readViewDepth(vUv - vec2(texel.x, 0.0));
      float depthRight = readViewDepth(vUv + vec2(texel.x, 0.0));
      float depthDown = readViewDepth(vUv - vec2(0.0, texel.y));
      float depthUp = readViewDepth(vUv + vec2(0.0, texel.y));
      float inverseCenter = 1.0 / depthCenter;
      float laplacian = abs(1.0 / depthLeft + 1.0 / depthRight - 2.0 * inverseCenter) + abs(1.0 / depthDown + 1.0 / depthUp - 2.0 * inverseCenter);
      float depthEdge = smoothstep(0.015, 0.04, laplacian / inverseCenter);
      float farthest = max(max(depthLeft, depthRight), max(depthDown, depthUp));
      float nearest = min(min(depthLeft, depthRight), min(depthDown, depthUp));
      float nearSide = step(depthCenter - nearest, farthest - depthCenter);
      vec3 normalCenter = readNormal(vUv);
      float normalDifference = max(
        1.0 - dot(normalCenter, readNormal(vUv + vec2(texel.x, 0.0))),
        1.0 - dot(normalCenter, readNormal(vUv + vec2(0.0, texel.y)))
      );
      float normalEdge = smoothstep(0.2, 0.4, normalDifference);
      float distanceFade = 1.0 - smoothstep(90.0, 170.0, depthCenter);
      float edge = max(depthEdge * nearSide, normalEdge * 0.85) * distanceFade;
      vec3 ink = mix(uInkColor, baseColor.rgb * 0.22, 0.45);
      gl_FragColor = vec4(mix(baseColor.rgb, ink, edge * 0.92), 1.0);
    }
  `,
  uniforms: {
    tColor: { value: null },
    tDepth: { value: null },
    tNormal: { value: null },
    uCameraFar: { value: 320 },
    uCameraNear: { value: 0.5 },
    uInkColor: { value: new THREE.Color(0.012, 0.014, 0.03) },
    uLineWidth: { value: 1 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: FULLSCREEN_VERTEX_SHADER,
});;

/* gradeMaterial（运行时状态，挂在 W 上） */
W.gradeMaterial = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  fragmentShader: /* glsl */`
    uniform sampler2D tInput;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uExposure;
    varying vec2 vUv;

    vec3 applyNeutralToneMap(vec3 color) {
      const float startCompression = 0.76;
      const float desaturation = 0.15;
      float lowest = min(color.r, min(color.g, color.b));
      float offset = lowest < 0.08 ? lowest - 6.25 * lowest * lowest : 0.04;
      color -= offset * 0.5;
      float peak = max(color.r, max(color.g, color.b));
      if (peak < startCompression) {
        return color;
      }
      float compressionRange = 1.0 - startCompression;
      float newPeak = 1.0 - compressionRange * compressionRange / (peak + compressionRange - startCompression);
      color *= newPeak / peak;
      float blend = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
      return mix(color, vec3(newPeak), blend);
    }

    vec3 convertLinearToSrgb(vec3 color) {
      return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, color));
    }

    float hashValue(vec2 point) {
      return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 color = texture2D(tInput, vUv).rgb * uExposure;
      float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color *= mix(vec3(0.9, 0.95, 1.1), vec3(1.05, 1.0, 0.93), smoothstep(0.02, 0.7, luminance));
      color = max(mix(vec3(luminance), color, 1.12), 0.0);
      color = applyNeutralToneMap(color);
      vec2 centered = vUv - 0.5;
      centered.x *= uResolution.x / uResolution.y;
      color *= mix(0.62, 1.0, smoothstep(1.05, 0.28, length(centered)));
      color = convertLinearToSrgb(clamp(color, 0.0, 1.0));
      color += (hashValue(vUv * uResolution + fract(uTime * 7.0) * 311.0) - 0.5) * 0.018;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    tInput: { value: null },
    uExposure: { value: 1.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: W.sharedUniforms.uTime,
  },
  vertexShader: FULLSCREEN_VERTEX_SHADER,
});;

/* fxaaMaterial（运行时状态，挂在 W 上） */
W.fxaaMaterial = new THREE.ShaderMaterial({
  depthTest: false,
  depthWrite: false,
  fragmentShader: FXAAShader.fragmentShader,
  uniforms: THREE.UniformsUtils.clone(FXAAShader.uniforms),
  vertexShader: FXAAShader.vertexShader,
});;

/* compositeQuad（运行时状态，挂在 W 上） */
W.compositeQuad = new FullScreenQuad(W.compositeMaterial);;

/* gradeQuad（运行时状态，挂在 W 上） */
W.gradeQuad = new FullScreenQuad(W.gradeMaterial);;

/* fxaaQuad（运行时状态，挂在 W 上） */
W.fxaaQuad = new FullScreenQuad(W.fxaaMaterial);;

/* bloomPass（运行时状态，挂在 W 上） */
W.bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.4, 1.15);;

/* reflectionScratch（运行时状态，挂在 W 上） */
W.reflectionScratch = {
  clipPlane: new THREE.Vector4(),
  farCorner: new THREE.Vector4(),
  look: new THREE.Vector3(),
  plane: new THREE.Plane(),
  planePoint: new THREE.Vector3(0, 0.02, 0),
  position: new THREE.Vector3(),
  up: new THREE.Vector3(),
};

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* viewportWidth（运行时状态，挂在 W 上） */
W.viewportWidth = 1;;

/* viewportHeight（运行时状态，挂在 W 上） */
W.viewportHeight = 1;;

/* qualityScale（运行时状态，挂在 W 上） */
W.qualityScale = 1;;

/* ── 顶层语句（世界/控制/事件/启动）── */
;

/* clock（运行时状态，挂在 W 上） */
W.clock = new THREE.Clock();;

/* elapsedTime（运行时状态，挂在 W 上） */
W.elapsedTime = 0;;
