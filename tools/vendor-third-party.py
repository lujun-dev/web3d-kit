"""把三方可复用件「搬运」进资产库（可复跑）。
搬运对象（都是 MIT / CC0 类宽松许可，只搬不改编）：
  1) three.js 官方 examples/jsm 的一批件（postprocessing / objects / geometries / math / utils / environments / effects / loaders / controls）
  2) 程序化可平铺着色器（tuxalin/procedural-tileable-shaders）
落点：assets/vendor/<来源>/...，原文件的许可头一字不动；另写 THIRD-PARTY-NOTICES.md 与 vendor 清单。
用法：python tools/vendor-third-party.py [--only three|shaders]
"""
import base64, json, os, re, shutil, subprocess, sys

ROOT = r"D:\hermes-output\web3d-kit"
OUT = os.path.join(ROOT, "assets", "vendor")
THREE_JSM = os.path.join(ROOT, "node_modules", "three", "examples", "jsm")
ONLY = None
for i, a in enumerate(sys.argv):
    if a == "--only": ONLY = sys.argv[i + 1]

# ── 1. three.js 官方 examples/jsm（精选）──
THREE_PICKS = [
    # 后处理（我们已有 bloom+FXAA，这些是能力扩展：AO / 屏幕空间反射 / LUT 调色 / 抗锯齿 / 合成器）
    "postprocessing/EffectComposer.js", "postprocessing/Pass.js", "postprocessing/RenderPass.js",
    "postprocessing/ShaderPass.js", "postprocessing/MaskPass.js", "postprocessing/OutputPass.js",
    "postprocessing/SMAAPass.js", "postprocessing/LUTPass.js", "postprocessing/GTAOPass.js",
    "postprocessing/SSRPass.js", "postprocessing/BokehPass.js", "postprocessing/UnrealBloomPass.js",
    # 物件：平面反射 / 折射（玻璃）/ 水面 / 天空 / 光晕 / 等值面
    "objects/Reflector.js", "objects/ReflectorForSSRPass.js", "objects/Refractor.js",
    "objects/Water.js", "objects/Sky.js", "objects/Lensflare.js", "objects/MarchingCubes.js",
    # 几何：贴花 / 圆角盒 / 凸包
    "geometries/DecalGeometry.js", "geometries/RoundedBoxGeometry.js", "geometries/ConvexGeometry.js",
    "math/ConvexHull.js", "math/Capsule.js",
    # 数学：噪声 / LUT / 表面采样 / 八叉树
    "math/SimplexNoise.js", "math/ImprovedNoise.js", "math/Lut.js", "math/MeshSurfaceSampler.js", "math/Octree.js",
    # 工具 / 环境 / 效果 / 加载器 / 控制
    "utils/BufferGeometryUtils.js", "utils/SceneUtils.js", "utils/UVsDebug.js",
    "environments/RoomEnvironment.js", "effects/OutlineEffect.js",
    "loaders/RGBELoader.js", "loaders/HDRLoader.js", "controls/OrbitControls.js",
    # 后处理依赖的着色器
    "shaders/BokehShader.js", "shaders/CopyShader.js", "shaders/GTAOShader.js",
    "shaders/LuminosityHighPassShader.js", "shaders/OutputShader.js", "shaders/PoissonDenoiseShader.js",
    "shaders/SMAAShader.js", "shaders/SSRShader.js",
    # 风格化「看相」着色器（做滤镜/后期时可直接用）
    "shaders/VignetteShader.js", "shaders/ColorifyShader.js", "shaders/RGBShiftShader.js",
    "shaders/DotScreenShader.js", "shaders/HalftoneShader.js", "shaders/ConvolutionShader.js",
]

def dep_closure(rel_paths):
    """把相对 import 的依赖闭包一并收集（保持原目录结构搬）"""
    seen, stack = set(), list(rel_paths)
    while stack:
        rel = stack.pop()
        if rel in seen: continue
        seen.add(rel)
        p = os.path.join(THREE_JSM, rel)
        if not os.path.exists(p): continue
        for m in re.finditer(r"from\s+'(\.[^']+)'", open(p, encoding="utf-8", errors="replace").read()):
            nxt = os.path.normpath(os.path.join(os.path.dirname(rel), m.group(1))).replace("\\", "/")
            if not nxt.endswith(".js"): nxt += ".js"
            if nxt not in seen: stack.append(nxt)
    return sorted(seen)

manifest = {"vendor": []}
if ONLY in (None, "three"):
    three_ver = json.load(open(os.path.join(ROOT, "node_modules", "three", "package.json"), encoding="utf-8"))["version"]
    files = dep_closure(THREE_PICKS)
    dst_root = os.path.join(OUT, "three", "examples", "jsm")
    os.makedirs(dst_root, exist_ok=True)
    for rel in files:
        src = os.path.join(THREE_JSM, rel)
        if not os.path.exists(src): print("跳过（不存在）", rel); continue
        dst = os.path.join(dst_root, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)                 # 原文件逐字搬，许可头不动
        manifest["vendor"].append({"name": os.path.basename(rel)[:-3], "path": "assets/vendor/three/examples/jsm/" + rel,
                                   "upstream": f"three.js examples/jsm", "version": three_ver, "license": "MIT"})
    os.makedirs(os.path.join(OUT, "three"), exist_ok=True)
    shutil.copyfile(os.path.join(ROOT, "node_modules", "three", "LICENSE"), os.path.join(OUT, "three", "LICENSE"))
    print(f"three examples/jsm：搬入 {len(files)} 个文件（含依赖闭包），版本 {three_ver}")

# ── 2. tuxalin/procedural-tileable-shaders（GLSL 程序化可平铺材质）──
if ONLY in (None, "shaders"):
    target = os.path.join(OUT, "procedural-tileable-shaders")
    os.makedirs(target, exist_ok=True)
    BARE = "tuxalin/procedural-tileable-shaders"
    got = []

    # 未登录的 GitHub API 只有 60 次/小时 → 有 gh 登录就用它的 token（5000 次/小时）
    TOKEN = ""
    for gh in (r"C:\\Program Files\\GitHub CLI\\gh.exe", "gh"):
        try:
            tk = subprocess.run([gh, "auth", "token"], capture_output=True, text=True, errors="replace")
            if tk.returncode == 0 and tk.stdout.strip():
                TOKEN = tk.stdout.strip(); break
        except Exception:
            pass
    AUTH = ["-H", f"Authorization: Bearer {TOKEN}"] if TOKEN else []

    def api_get(path):
        """raw.githubusercontent.com 国内常被 reset → 走 api.github.com（base64）"""
        r = subprocess.run(["curl", "-sS", "--max-time", "30", *AUTH,
                            f"https://api.github.com/repos/{BARE}/contents/{path}"], capture_output=True)
        try:
            j = json.loads(r.stdout.decode("utf-8", "replace"))
            if not isinstance(j, dict) or "content" not in j: return None
            return base64.b64decode(j["content"])
        except Exception:
            return None

    # 一次性取整棵树（比逐目录列快、也不会被目录列表结构坑到）
    tree = subprocess.run(["curl", "-sS", "--max-time", "30", *AUTH,
                           f"https://api.github.com/repos/{BARE}/git/trees/master?recursive=1"],
                          capture_output=True)
    paths = []
    try:
        tj = json.loads(tree.stdout.decode("utf-8", "replace"))
        if isinstance(tj, dict) and isinstance(tj.get("tree"), list):
            paths = [e["path"] for e in tj["tree"] if e.get("type") == "blob"]
    except Exception:
        paths = []
    keep = [q for q in paths if q.split("/")[-1].lower().startswith(("license", "readme"))
            or q.endswith((".glsl", ".frag", ".vert", ".vert.glsl", ".frag.glsl", ".js", ".txt", ".md"))]
    if not keep:      # 树 API 拿不到就退回已知根目录清单
        keep = ["LICENSE", "README.md", "cellularNoise.glsl", "debug.glsl", "fbm.glsl", "fbmImage.glsl",
                "gradientNoise.glsl", "hash.glsl", "hexagons.glsl", "interpolate.glsl", "metric.glsl",
                "multiHash.glsl", "noise.glsl", "patterns.glsl", "perlinNoise.glsl", "voronoi.glsl", "warp.glsl"]
    for q in keep:
        data = api_get(q)
        if data is None:
            print("  抓取失败", q); continue
        dst = os.path.join(target, q.replace("/", os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        open(dst, "wb").write(data); got.append(q)
    print(f"procedural shaders：抓入 {len(got)} 个文件（图片/网页跳过）")
    for q in got:
        manifest["vendor"].append({"name": os.path.basename(q), "path": "assets/vendor/procedural-tileable-shaders/" + q,
                                   "upstream": BARE, "version": "master", "license": "见包内 LICENSE"})

# ── 3. 清单 + 三方声明 ──
mf_path = os.path.join(ROOT, "assets", "manifest.json")
mf = json.load(open(mf_path, encoding="utf-8"))
mf["vendor"] = manifest["vendor"]
json.dump(mf, open(mf_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

vendored_three = [v for v in manifest["vendor"] if v["upstream"].startswith("three.js")]
notices = ["# 第三方件声明（THIRD-PARTY NOTICES）", "",
           "本仓库 `assets/` 下的自有资产（regions/props/systems/core/scene）为本地机械拆解产物；",
           "`assets/vendor/` 下是**搬运进来的第三方件**，逐字未改，各自的许可与版权如下。", ""]
if vendored_three:
    notices += [f"## three.js examples/jsm（{len(vendored_three)} 个文件 · MIT）", "",
                "来源：three.js 官方仓库 `examples/jsm/`（通过 npm 包 `three` 分发）。",
                "许可：MIT —— 版权归 three.js authors，全文见 `assets/vendor/three/LICENSE`。", ""]
others = [v for v in manifest["vendor"] if not v["upstream"].startswith("three.js")]
if others:
    notices += ["## " + others[0]["upstream"] + f"（{len(others)} 个文件）", "",
                "来源：" + others[0]["upstream"] + "（GitHub）。许可与版权见包内 LICENSE 文件。", ""]
notices += ["## 使用纪律", "",
            "- 搬运件**不改写**：要改就新写一个件，别动 vendor 下的文件，将来好整包升级。",
            "- 升级方式：改 `tools/vendor-third-party.py` 里的版本/清单 → 重跑 → 跑 `node tools/verify-vendor.mjs`。",
            "- 自有资产与搬运件的分界必须清楚：文档里只写「搬运自 three.js 官方 / 见 THIRD-PARTY-NOTICES」，不写任何本地参照来源。", ""]
open(os.path.join(ROOT, "THIRD-PARTY-NOTICES.md"), "w", encoding="utf-8", newline="\n").write("\n".join(notices))

readme = f"""# assets/vendor —— 搬运进来的第三方件（不改写）

这里是**搬运件**，不是自拆件：文件逐字来自上游，许可头保留，方便整体升级。

| 来源 | 件数 | 许可 | 说明 |
|---|---|---|---|
| three.js `examples/jsm`（{vendored_three[0]['version'] if vendored_three else '-'}） | {len(vendored_three)} | MIT | 后处理（EffectComposer/SSRPass/GTAOPass/LUTPass/SMAAPass/OutputPass/BokehPass/UnrealBloomPass）· 物件（Reflector/ReflectorForSSRPass/Refractor/Water/Sky/Lensflare/MarchingCubes）· 几何与数学（DecalGeometry/RoundedBoxGeometry/ConvexGeometry/ConvexHull/SimplexNoise/ImprovedNoise/Lut/MeshSurfaceSampler/Octree）· 工具（BufferGeometryUtils/SceneUtils/UVsDebug）· RoomEnvironment · OutlineEffect · RGBELoader/HDRLoader · OrbitControls · 依赖的 shaders |
| tuxalin/procedural-tileable-shaders | {len(others)} | 见包内 LICENSE | 程序化**可平铺**材质（GLSL），补我们「只有 canvas 贴图、没有 shader 材质件」的空档 |

用法：直接按原路径 import（我们把 `examples/jsm` 的目录结构原样保留，内部相对 import 不用改）：

```js
import {{ Reflector }} from '../assets/vendor/three/examples/jsm/objects/Reflector.js';
import {{ SSRPass }} from '../assets/vendor/three/examples/jsm/postprocessing/SSRPass.js';
```

运行时 `three` 由 importmap 提供，**版本要与搬运件的版本一致**（本包对 three {vendored_three[0]['version'] if vendored_three else '—'} 搬运）。

自检：`node tools/verify-vendor.mjs`（把这些件逐个 import 并实例化一遍，核对运行时 API 对得上）。
"""
open(os.path.join(OUT, "README.md"), "w", encoding="utf-8", newline="\n").write(readme)
print("vendor 件总数:", len(manifest["vendor"]))
