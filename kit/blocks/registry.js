/* kit · 积木注册表：把整个场景拆成一堆可复用块，按清单拼装
   块定义：{ id, round(1几何/2贴图/3着色器), tags[], build(bk, opts) → void | { group?, animate? } }
   场景写法：placeBlocks(bk, group, [{ id: 'cn/rock', at: [x, z], opts: {...} }, 'cn/base']) */
/* 分轮：读 URL 的 ?step=（1 几何 / 2 贴图 / 3 着色器与后处理），默认 3 */
export function currentStage() {
  const raw = Number(new URLSearchParams(location.search).get('step') || 3);
  return Number.isFinite(raw) ? Math.min(3, Math.max(1, raw)) : 3;
}

export const BLOCKS = new Map();

export function block(def) {
  if (!def || !def.id || typeof def.build !== 'function') throw new Error('积木定义不合法: ' + JSON.stringify(def));
  BLOCKS.set(def.id, def);
  return def;
}

export function getBlock(id) {
  const found = BLOCKS.get(id);
  if (!found) throw new Error('未注册的积木: ' + id + '（已注册：' + [...BLOCKS.keys()].join(', ') + '）');
  return found;
}

export function listBlocks(filter) {
  return [...BLOCKS.values()]
    .filter((b) => !filter || (filter.round === undefined || b.round <= filter.round) && (!filter.tag || b.tags.includes(filter.tag)))
    .map((b) => ({ id: b.id, round: b.round, tags: b.tags }));
}

/* 按清单拼装。step 是当前轮次：round 大于 step 的块会被跳过（第一轮只摆几何，第二轮加贴图，第三轮加着色器） */
export function placeBlocks(bk, parent, list, ctx = {}) {
  const step = ctx.step === undefined ? currentStage() : ctx.step;
  const placed = [];
  const skipped = [];
  const animators = [];
  for (const raw of list) {
    const item = typeof raw === 'string' ? { id: raw } : raw;
    const def = getBlock(item.id);
    if (def.round > step) { skipped.push(item.id); continue; }
    const opts = Object.assign({}, item.opts || {}, item.at ? { at: item.at } : {});
    const out = def.build(bk, opts);
    if (out && out.group) parent.add(out.group);
    if (out && typeof out.animate === 'function') animators.push(out.animate);
    placed.push(item.id);
  }
  return { placed, skipped, animators };
}
