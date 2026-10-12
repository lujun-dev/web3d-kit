/* kit · 雨夜小景通用管线 preset
   一条链子：PMREM 环境光 → 三渲二描边(inverted hull) → 湿地面平面反射 → 后期(泛光/ACES调色/亮度对比/暗角/SMAA)
   用法：
     import { createWetNightApp } from '<kit>/lib/pipeline.js';
     const app = createWetNightApp({ canvas, shops, env, grade, camera });
     app.api 就是 window.__shop（自检脚本用） */
import * as THREE from 'three';
import {
  EffectComposer, EffectPass, RenderPass, BloomEffect, SMAAEffect,
  ToneMappingEffect, ToneMappingMode, VignetteEffect, BlendFunction, BrightnessContrastEffect,
} from 'postprocessing';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  LAYER, PARTS, applyCameraPose, buildMaterials, createOutlineMaterial, createStage, makeSky, setOutlineMaterial, withSeed, setStage, currentStage, 
} from './engine.js';

export function createWetNightApp(options) {
  const { canvas, shops } = options;
  const env = Object.assign({ intensity: 0.34, fog: 0.014, ambient: 0.9, hemi: 0.62, fill: 0.42, outline: '#15100d', outlineWidth: 0.02,
    fogColor: 0x121a2c, ambientColor: 0x3d5175, hemiSky: 0x6280b8, hemiGround: 0x33241a, fillColor: 0x93abd8 }, options.env || {});
  const post = Object.assign({ bloom: 1.05, threshold: 0.8, smoothing: 0.25, radius: 0.6, tone: ToneMappingMode.ACES_FILMIC, brightness: 0.115, contrast: 0.05, vignetteOffset: 0.32, vignetteDarkness: 0.34 }, options.post || {});

  const step = options.step === undefined ? 3 : options.step;
  setStage(step);
  const stage = createStage(canvas);
  const { renderer, scene, camera, controls } = stage;
  /* 第 3 轮用后期链自己做色调映射；前两轮没有后期，直接让渲染器做 ACES，否则几何轮黑得看不清 */
  renderer.toneMapping = step >= 3 ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = step >= 3 ? 1.0 : 2.6;  /* 无后期的轮次抬高曝光，便于看形体 */
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  buildMaterials(renderer, { step });
  if (step >= 2) setOutlineMaterial(createOutlineMaterial(env.outline, env.outlineWidth));

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = env.intensity;
  scene.fog = new THREE.FogExp2(env.fogColor, env.fog);
  scene.add(new THREE.AmbientLight(env.ambientColor, env.ambient));
  scene.add(new THREE.HemisphereLight(env.hemiSky, env.hemiGround, env.hemi));
  const fill = new THREE.DirectionalLight(env.fillColor, env.fill);
  fill.position.set(6, 10, 14);
  scene.add(fill, makeSky());

  const composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType });
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new BloomEffect({ intensity: post.bloom, luminanceThreshold: post.threshold, luminanceSmoothing: post.smoothing, mipmapBlur: true, radius: post.radius });
  const grade = new BrightnessContrastEffect({ brightness: post.brightness, contrast: post.contrast });
  if (step >= 3) {
    composer.addPass(new EffectPass(
      camera,
      bloom,
      new ToneMappingEffect({ mode: post.tone, resolution: 256 }),
      grade,
      new VignetteEffect({ blendFunction: BlendFunction.NORMAL, offset: post.vignetteOffset, darkness: post.vignetteDarkness }),
      new SMAAEffect(),
    ));
  }

  let current = null; let frames = 0; let elapsed = 0;
  const clock = new THREE.Clock();

  function show(index) {
    if (index < 0 || index >= shops.length) return null;
    if (current) scene.remove(current.group);
    current = options.seed === undefined ? shops[index].build() : withSeed(options.seed, () => shops[index].build());
    scene.add(current.group);
    applyCameraPose(camera, controls, current.pose);
    canvas.classList.add('is-ready');
    return { id: shops[index].id, name: shops[index].name };
  }
  function resize() {
    const w = Math.max(1, window.innerWidth); const h = Math.max(1, window.innerHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    composer.setSize(w, h);
  }
  function loop() {
    requestAnimationFrame(loop);
    const delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;
    controls.update();
    if (current && current.animate) current.animate(delta, elapsed);
    if (step >= 3) composer.render(delta); else renderer.render(scene, camera);
    frames += 1;
  }
  window.addEventListener('resize', resize);
  resize();
  if (shops.length) show(0);
  loop();

  const api = {
    ready: true, show,
    frames: () => frames,
    parts: () => PARTS,
    effects: () => (current && current.effects) || null,
    shops: shops.map((s) => ({ id: s.id, name: s.name, note: s.note })),
    toggleBloom: (on) => { bloom.enabled = on === undefined ? !bloom.enabled : on; return bloom.enabled; },
    toggleUi: () => true,
    step: () => currentStage(),
    stats: () => {
      let meshes = 0; let triangles = 0;
      if (current) current.group.traverse((o) => {
        if (!o.isMesh && !o.isSprite) return;
        meshes += 1;
        if (o.geometry && o.geometry.index) triangles += o.geometry.index.count / 3;
        else if (o.geometry && o.geometry.attributes.position) triangles += o.geometry.attributes.position.count / 3;
      });
      return { meshes, triangles: Math.round(triangles), frames, passDrawCalls: renderer.info.render.calls,
        camera: camera.position.toArray().map((v) => +v.toFixed(2)),
        target: controls.target.toArray().map((v) => +v.toFixed(2)),
        envIntensity: scene.environmentIntensity, fog: !!scene.fog };
    },
    composition: () => {
      const counts = { pointLight: 0, spotLight: 0, dirLight: 0, hemiLight: 0, ambientLight: 0, mesh: 0, sprite: 0, reflector: 0, shaderMaterial: 0, toonMaterial: 0 };
      scene.traverse((n) => {
        const t = n.type;
        if (t === 'PointLight') counts.pointLight += 1;
        else if (t === 'SpotLight') counts.spotLight += 1;
        else if (t === 'DirectionalLight') counts.dirLight += 1;
        else if (t === 'HemisphereLight') counts.hemiLight += 1;
        else if (t === 'AmbientLight') counts.ambientLight += 1;
        else if (t === 'Reflector') counts.reflector += 1;
        else if (n.isMesh) counts.mesh += 1;
        if (n.isSprite) counts.sprite += 1;
        const m = n.material;
        if (m && m.isShaderMaterial) counts.shaderMaterial += 1;
        else if (m && m.isMeshToonMaterial) counts.toonMaterial += 1;
      });
      return counts;
    },
    project: (x, y, z) => {
      const p = new THREE.Vector3(x, y, z).project(camera);
      return { x: Math.round((p.x * 0.5 + 0.5) * window.innerWidth), y: Math.round((-p.y * 0.5 + 0.5) * window.innerHeight) };
    },
    setPose: (pose) => { applyCameraPose(camera, controls, pose); return true; },
    layers: LAYER,
  };
  return { renderer, scene, camera, controls, composer, bloom, show, api };
}
