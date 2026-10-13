"""把基准单文件里的资产按「一件一文件」拆成可复用模块（机械拆分，不改写实现）。
- 资产件：regions/*（程序化贴图）· props/*（构件）· systems/*（机制）· scene/*（场景形状与装配）
- 运行时状态：所有会被跨模块改写的绑定（atlas/buckets/scene/renderer/materials/... 与 let 变量）集中到 core/world.js 的 W，写法 W.名字
用法：python tools/split-assets.py
"""
import json, os, re, sys

BASE = r"D:\hermes-output\web3d-kit-baseline\opus55-雨夜便利店.html"
ROOT = r"D:\hermes-output\web3d-kit"
OUT = os.path.join(ROOT, "assets")
SRC = "本地基准单文件（不进仓库、文档里不出现文件名）"

# ═══ 1. 顶层切块 ═══
def top_level_chunks(code):
    chunks, i, n, start, depth = [], 0, len(code), None, 0
    while i < n:
        c = code[i]
        if c == "/" and i + 1 < n and code[i+1] == "/":
            j = code.find("\n", i); i = j + 1 if j != -1 else n; continue
        if c == "/" and i + 1 < n and code[i+1] == "*":
            j = code.find("*/", i + 2); i = j + 2 if j != -1 else n; continue
        if c in "'\"":
            q = c; i += 1
            while i < n:
                if code[i] == "\\": i += 2; continue
                if code[i] == q: i += 1; break
                i += 1
            continue
        if c == "`":
            i += 1; tdepth = 0
            while i < n:
                if code[i] == "\\": i += 2; continue
                if code[i] == "$" and i + 1 < n and code[i+1] == "{": tdepth += 1; i += 2; continue
                if code[i] == "}" and tdepth > 0: tdepth -= 1; i += 1; continue
                if code[i] == "`" and tdepth == 0: i += 1; break
                i += 1
            continue
        if c in "{[(": depth += 1
        elif c in "}])": depth -= 1
        if depth == 0:
            if start is None and not c.isspace(): start = i
            if start is not None and c in ";}":
                if c == "}":
                    k = i + 1
                    while k < n and code[k] in " \t\r\n": k += 1
                    cont = k < n and code[k] in ".,([`+-*/%<>=&|?:"
                    if cont and code[k] == "/" and k + 1 < n and code[k+1] in "/*":
                        cont = False        # /* 或 // 是下一段注释，不是相除续行
                    if cont:
                        i += 1; continue
                chunks.append(code[start:i+1]); start = None
        i += 1
    if start is not None: chunks.append(code[start:])
    return [c.strip() for c in chunks if c.strip()]

# ═══ 2. 只在「代码区」替换标识符（跳过注释/字符串/模板串原文）═══
def rewrite_idents(code, mapping):
    out, i, n = [], 0, len(code)
    while i < n:
        c = code[i]
        if c == "/" and i + 1 < n and code[i+1] == "/":
            j = code.find("\n", i); j = n if j == -1 else j
            out.append(code[i:j]); i = j; continue
        if c == "/" and i + 1 < n and code[i+1] == "*":
            j = code.find("*/", i + 2); j = n if j == -1 else j + 2
            out.append(code[i:j]); i = j; continue
        if c in "'\"":
            q = c; j = i + 1
            while j < n:
                if code[j] == "\\": j += 2; continue
                if code[j] == q: j += 1; break
                j += 1
            out.append(code[i:j]); i = j; continue
        if c == "`":
            # 模板串：原文照抄，但 ${...} 里面是代码 → 递归处理
            j = i + 1; buf = ["`"]
            while j < n:
                if code[j] == "\\": buf.append(code[j:j+2]); j += 2; continue
                if code[j] == "$" and j + 1 < n and code[j+1] == "{":
                    # 找到配对的 }
                    k = j + 2; depth = 1
                    while k < n and depth:
                        if code[k] == "{": depth += 1
                        elif code[k] == "}": depth -= 1
                        k += 1
                    buf.append("${" + rewrite_idents(code[j+2:k-1], mapping) + "}"); j = k; continue
                if code[j] == "`": buf.append("`"); j += 1; break
                buf.append(code[j]); j += 1
            out.append("".join(buf)); i = j; continue
        if c.isalpha() or c in "_$":
            j = i
            while j < n and (code[j].isalnum() or code[j] in "_$"): j += 1
            word = code[i:j]
            prev = code[i-1] if i else " "
            nxt = code[j] if j < n else " "
            is_prop = (i > 0 and code[i-1] == "." and not (i > 1 and code[i-2] == "."))
            if word in mapping and not is_prop and nxt != ":":
                out.append(mapping[word])
            else:
                out.append(word)
            i = j; continue
        out.append(c); i += 1
    return "".join(out)

html = open(BASE, encoding="utf-8", errors="replace").read()
mod = re.search(r'<script type="module">\n(.*)\n</script>', html, re.S).group(1)
# 先把裸导入整条摘掉（单行 import ...;），避免 { } 让切块器误切
BARE_IMPORTS = re.findall(r"^import[^\n]*;", mod, re.M)
mod = re.sub(r"^import[^\n]*;\n?", "", mod, flags=re.M)
chunks = top_level_chunks(mod)

ADDON_MAP = {"OrbitControls": "three/addons/controls/OrbitControls.js",
             "UnrealBloomPass": "three/addons/postprocessing/UnrealBloomPass.js",
             "FullScreenQuad": "three/addons/postprocessing/Pass.js",
             "FXAAShader": "three/addons/shaders/FXAAShader.js",
             "mergeGeometries": "three/addons/utils/BufferGeometryUtils.js"}

items = []      # dict(kind, name, body, idx)
idx = 0
for ch in chunks:
    m = re.match(r"(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)", ch)
    if m: items.append(dict(kind="function", name=m.group(1), body=ch, idx=idx)); idx += 1; continue
    m = re.match(r"(?:export\s+)?(const|let|var)\s+([A-Za-z_$][\w$]*)", ch)
    if m: items.append(dict(kind=m.group(1), name=m.group(2), body=ch, idx=idx)); idx += 1; continue
    m = re.match(r"(?:export\s+)?class\s+([A-Za-z_$][\w$]*)", ch)
    if m: items.append(dict(kind="class", name=m.group(1), body=ch, idx=idx)); idx += 1; continue
    items.append(dict(kind="stmt", name=None, body=ch, idx=idx)); idx += 1

named = {it["name"]: it for it in items if it["name"]}

# ═══ 3. 分类 ═══
CONST_HINT = re.compile(r"^(BRAND|CHANNEL|FACE|FONT_|FLOOR_Y|LOT_Y|GLASS_|GROUND_|WET_|COLORS|LAYER_|SHRUB_|HYDRANGEA_|PACKAGE_|MAGAZINE_|BOTTLE_|CATEGORY_|PRODUCT_|SIGNAL_|SPLASH_|PUDDLES|TEXT_SAMPLE|PANEL_ROTATIONS|LIGHT_TINT|FULLSCREEN_|CAKE|Y_AXIS|MAX_|SHADOW_)")
SCENE_NAMES = {"initialize","createLotShape","createFarFrontShape","createFarRightShape","createGroundGeometry","drawGroundAlbedo","drawWetMask"}
CORE_GEOM = {"GeometryBucket","addBox","addBlock","addMesh","addQuad","addTri","addCylinder","addSphere","addRod","addPanel","addTube","addWire","addShrub","addUmbrella","addEffectMesh","addWetBlob","withTransform","getCurrentTransform","getCachedGeometry","composeMatrix","pushGeom","bleed","faceDimensions","setUV","applyColor","applyBoxUV","finalizeBuckets","createQuadGeometry","createTriangleProduct","createRoundedTriangleShape"}
CORE_CANVAS = {"createCanvas","drawText","drawVerticalText","drawGrate","drawPavers","drawTactilePaving","getSubRect","extendAtlasEdges","fillRoundedRect","fillCircle","fillEllipse","fillPolygon","fillCornerOutside","fillGroundRect","fillCaseTier","traceRoundedRect","traceStar","drawDiamondMarking","createGradientTexture"}
CORE_MATH = {"randomBetween","pickRandom","hashNumber","createRandomGenerator","random","computePixelRatio"}
CORE_MAT = {"createGlassMaterial","createGroundMaterial","createToonMaterial","createPointLight","createSpotLight","createLightCone","makeGlowSprite","makeLightPool","makeSky","gradientTexture","getGlowTexture","toonFrom","createBackgroundTexture"}
CORE_UTIL = {"resolveColor","resolvePaint","toGroundX","toGroundY","toWetX","toWetY","getClosedUmbrellaGeometry","getFrontFace","getLeftPerpendicular","getSignalState","computeStoreSignLevel","computeFailingTubeLevel","computeSecurityLevel","computeHangingSignLevel","computeTelevisionLevel"}
SINGLETONS = {"atlas","atlasRects","buckets","transformStack","scene","renderer","camera","controls","clock","materials","lights","door",
              "splashState","dripState","overflowStream","catState","fans","reflectionScratch","reflectionTarget","sceneTarget","normalTarget",
              "compositeTarget","gradeTarget","compositeMaterial","gradeMaterial","fxaaMaterial","normalPassMaterial","compositeQuad","gradeQuad",
              "fxaaQuad","bloomPass","sharedUniforms","groundGradient","backgroundTexture","backgroundColor","blackColor","normalClearColor",
              "whiteRect","scratchNormal","scratchNormalMatrix","scratchPosition","scratchMatrix","elapsedTime","viewportWidth","viewportHeight",
              "frameCount","pixelRatio","atlasTexture","hasFloatBuffers","hdrType","canvasElement","Y_AXIS"}
inW = set()
for nm, it in named.items():
    if it["kind"] in ("let", "var") or nm in SINGLETONS: inW.add(nm)

def classify(it):
    name, kind = it["name"], it["kind"]
    if name is None: return "core/world"
    if name in inW: return "core/world"                 # 运行时状态统一集中
    if name in SCENE_NAMES: return "scene"
    if name in CORE_GEOM: return "core/geometry"
    if name in CORE_CANVAS: return "core/canvas"
    if name in CORE_MATH: return "core/math"
    if name in CORE_MAT: return "core/materials"
    if name in CORE_UTIL: return "core/util"
    if name in ("atlas","atlasRects"): return "core/atlas"
    if CONST_HINT.match(name) or name.isupper(): return "core/constants"
    if name.startswith("draw"): return "regions"
    if name.startswith("build"): return "props"
    if name.startswith("create") or name.startswith("update") or name in ("registerFan","registerDripSources","respawnSplash","triggerSplash","addDripSource","animate","renderFrame","placeInitialCamera","handleResize","trackPerformance","waitForFonts","loadStylesheet","waitFor","updateReflectionCamera","registerArt","buildMaterials","setStage","currentStage"): return "systems"
    return "core/util"

for it in items: it["cat"] = classify(it)

# 启动调用（initialize();）交给场景入口
STARTUP = []
kept = []
for it in items:
    if it["kind"] == "stmt" and re.fullmatch(r"initialize\(\);?", it["body"]):
        STARTUP.append(it["body"]); continue
    kept.append(it)
items = kept

CAT_FILE = {"core/constants":"core/constants.js","core/canvas":"core/canvas.js","core/math":"core/math.js","core/geometry":"core/geometry.js",
            "core/materials":"core/materials.js","core/util":"core/util.js","core/atlas":"core/atlas.js","core/world":"core/world.js","scene":"scene/index.js"}
def path_of(it):
    cat = it["cat"]
    return CAT_FILE.get(cat, f"{cat}/{it['name']}.js")

MAP = {nm: "W." + nm for nm in inW}

def local_decls(body):
    """块内自己声明的名字（let/const/var + 形参 + catch/for 绑定）→ 这些名字不能用 W. 前缀"""
    out = set(re.findall(r"(?:let|const|var)\s+([A-Za-z_$][\w$]*)", body))
    for m in re.finditer(r"function\s*[A-Za-z_$\w$]*\s*\(([^)]*)\)", body):
        for piece in m.group(1).split(","):
            p2 = piece.strip().split("=")[0].strip()
            if re.fullmatch(r"[A-Za-z_$][\w$]*", p2): out.add(p2)
    for m in re.finditer(r"catch\s*\(\s*([A-Za-z_$][\w$]*)", body): out.add(m.group(1))
    return out

def body_map(body):
    """本块要替换的名字：W 绑定→W.名字；但被本块局部变量遮蔽的，改成 名字$local 以免改写坏掉"""
    locals_here = local_decls(body)
    m = {}
    for nm in inW:
        if nm in locals_here: m[nm] = nm + "$local"
        else: m[nm] = "W." + nm
    return m
MANIFEST = {"parts": [], "counts": {}}
files = {}
for it in items:
    p = path_of(it)
    files.setdefault(p, []).append(it)
    if it["name"]:
        MANIFEST["parts"].append({"name": it["name"], "file": p, "category": it["cat"], "lines": it["body"].count("\n") + 1})

# 归属表（供 import 解析）
owner = {}
for it in items:
    if it["name"]: owner[it["name"]] = path_of(it)

def _is_prop(code, i):
    """i 处标识符前是不是单个 '.'（属性访问）；...name 的展开运算符不算"""
    return i > 0 and code[i-1] == "." and not (i > 1 and code[i-2] == ".")

def uses_name(code, nm):
    for m in re.finditer(r"(?<![\w$])" + re.escape(nm) + r"(?![\w$])", code):
        if _is_prop(code, m.start()): continue
        return True
    return False

def deps(body, self_name):
    out = set()
    for nm in named:
        if nm == self_name or nm in inW: continue
        if uses_name(body, nm): out.add(nm)
    return out

HEAD = "/* 由 tools/split-assets.py 从基准机械拆出：只搬移代码 + 生成 import/export，未改写实现。 */\n"
for p in sorted(files):
    lst = sorted(files[p], key=lambda x: x["idx"])
    imp, uses_W = {}, p != "core/world.js"
    addons, uses_three = set(), False
    body_out = []
    for it in lst:
        raw = it["body"]
        if "THREE." in raw: uses_three = True
        for a in ADDON_MAP:
            if re.search(r"(?<![\w$.])" + a + r"(?![\w$])", raw): addons.add(a)
        for d in deps(raw, it["name"] or "\u0000"):
            if d in owner and owner[d] != p: imp.setdefault(owner[d], set()).add(d)
        if it["kind"] in ("const", "let", "var") and it["name"] in inW:
            init = re.sub(r"^(?:export\s+)?(?:const|let|var)\s+" + re.escape(it["name"]) + r"\s*=", "W." + it["name"] + " =", raw, count=1)
            body_out.append(f"/* {it['name']}（运行时状态，挂在 W 上） */\n" + rewrite_idents(init, {k: v for k, v in body_map(init).items() if k != it['name']}) + ";")
        elif it["name"] is None:
            body_out.append("/* ── 顶层语句（世界/控制/事件/启动）── */\n" + rewrite_idents(raw, body_map(raw)))
        else:
            body_out.append(f"/* {it['name']}（{it['cat']}） */\nexport " + rewrite_idents(raw, body_map(raw)))
    lines = [HEAD]
    if uses_three: lines.append("import * as THREE from 'three';")
    for a in sorted(addons): lines.append(f"import {{ {a} }} from '{ADDON_MAP[a]}';")
    if uses_W:
        rel = os.path.relpath("core/world.js", os.path.dirname(p) or ".").replace("\\", "/")
        if not rel.startswith("."): rel = "./" + rel
        lines.append(f"import {{ W }} from '{rel}';")
    for src, names in sorted(imp.items()):
        rel = os.path.relpath(src, os.path.dirname(p) or ".").replace("\\", "/")
        if not rel.startswith("."): rel = "./" + rel
        ns = sorted(names)
        lines.append(("import {\n  " + ",\n  ".join(ns) + f",\n}} from '{rel}';") if len(ns) > 5 else ("import { " + ", ".join(ns) + f" }} from '{rel}';"))
    text = "\n".join(lines) + "\n\n" + "\n\n".join(body_out) + "\n"
    fp = os.path.join(OUT, p)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, "w", encoding="utf-8", newline="\n").write(text)
    MANIFEST["counts"][p] = len(lst)

# world.js 头部先声明 W
fp = os.path.join(OUT, "core", "world.js")
cur = open(fp, encoding="utf-8").read().split("\n")
head = ["/* 世界与运行时状态（基准里会被跨模块改写的绑定都集中在这里，写法 W.名字，与基准同名）。",
        "   资产件只通过 W 读写这些状态：ES 模块的具名导入是只读的，不能跨模块赋值。 */", "", "export const W = {};"]
open(fp, "w", encoding="utf-8", newline="\n").write("\n".join(head) + "\n" + "\n".join(cur[1:]))

# 场景入口 + 目录索引
sname = "rainy-night-konbini"
open(os.path.join(OUT, "scene", f"{sname}.js"), "w", encoding="utf-8", newline="\n").write(
    "/* 示例装配：把资产件按基准原样拼回同一场雨夜街景（这是装配范例，不是新做的场景）。\n"
    "   只 import 这一个文件，世界与场景就会按基准顺序建起来。 */\n"
    "import '../core/world.js';\n"
    "import { initialize } from './index.js';\n\n"
    "export const ready = " + (STARTUP[0] if STARTUP else "initialize();") + "\n")
for folder in ("regions", "props", "systems"):
    names = sorted(os.path.splitext(f)[0] for f in os.listdir(os.path.join(OUT, folder)) if f.endswith(".js") and f != "index.js")
    open(os.path.join(OUT, folder, "index.js"), "w", encoding="utf-8", newline="\n").write(
        "/* 目录索引：该目录下全部资产件（按需取用，不必全引）。 */\n" + "\n".join(f"export * from './{n}.js';" for n in names) + "\n")
# 贴图登记尺寸 + 构件索引（供借用者按清单挑件）
reg = {}
for m in re.finditer(r"atlasRects\.(\w+)\s*=\s*atlas\.register\((\d+),\s*(\d+),\s*([^;]+?)\);", open(BASE, encoding="utf-8", errors="replace").read(), re.S):
    fn = re.search(r"draw(\w+)", m.group(4))
    reg[m.group(1)] = {"size": [int(m.group(2)), int(m.group(3))], "region": fn.group(1) if fn else None}
json.dump(reg, open(os.path.join(OUT, "region-list.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
json.dump({p["name"]: {"file": p["file"], "lines": p["lines"]} for p in MANIFEST["parts"] if p["category"] == "props"},
          open(os.path.join(OUT, "props-index.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
json.dump(MANIFEST, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("文件:", len(files), "| 部件:", len(MANIFEST["parts"]), "| W 绑定:", len(inW))
for k in sorted(MANIFEST["counts"]): print(f"  {MANIFEST['counts'][k]:3d}  {k}")
