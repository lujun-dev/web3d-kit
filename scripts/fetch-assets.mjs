#!/usr/bin/env node
/* 一键重下素材（仓库里不存素材本体，只存这份清单与脚本）
 *
 *   node scripts/fetch-assets.mjs              下载缺失项 + 校验 + 回写 sha256
 *   node scripts/fetch-assets.mjs --verify-only  只校验（CI 用）
 *   node scripts/fetch-assets.mjs --only paving-stones
 *
 * 清单条目：
 *   { name, kind, dest, note, sha256? }
 *   kind = polyhaven{slug,res} | ambientcg{id,res,type} | direct{url}
 *
 * 已存在且 sha256 对得上 → 跳过；对不上 → 重新下载并覆盖。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK = path.join(ROOT, 'assets.lock.json');
const verifyOnly = process.argv.includes('--verify-only');
const oi = process.argv.indexOf('--only');
const only = oi > -1 ? process.argv[oi + 1] : null;

const lock = JSON.parse(fs.readFileSync(LOCK, 'utf8'));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

async function resolveUrl(e) {
  if (e.kind === 'polyhaven') {
    const r = await fetch(`https://api.polyhaven.com/files/${e.slug}`);
    if (!r.ok) throw new Error(`polyhaven api ${r.status} for ${e.slug}`);
    const meta = await r.json();
    const url = meta?.hdri?.[e.res || '1k']?.hdr?.url || meta?.hdri?.[e.res || '1k']?.exr?.url;
    if (!url) throw new Error(`polyhaven: no hdri ${e.res || '1k'} for ${e.slug}`);
    return url;
  }
  if (e.kind === 'ambientcg') {
    return `https://ambientcg.com/get?file=${e.id}_${e.res || '1K'}-${e.type || 'JPG'}.zip`;
  }
  if (e.kind === 'direct') return e.url;
  throw new Error('unknown kind: ' + e.kind);
}

let changed = false, ok = 0, bad = 0;
for (const e of lock.assets) {
  if (only && e.name !== only) continue;
  const dest = path.join(ROOT, e.dest);
  const have = fs.existsSync(dest);
  if (have && e.sha256) {
    const got = sha(fs.readFileSync(dest));
    if (got === e.sha256) { console.log(`[ok]   ${e.name} 已就位且校验通过`); ok++; continue; }
    console.log(`[warn] ${e.name} 校验不符，重新下载`);
  }
  if (verifyOnly) { console.log(`[fail] ${e.name} 缺失或未校验`); bad++; continue; }
  const url = await resolveUrl(e);
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) { console.log(`[fail] ${e.name} 下载失败 ${res.status} ← ${url}`); bad++; continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  e.sha256 = sha(buf);
  e.bytes = buf.length;
  e.sourceUrl = url;
  e.fetchedAt = new Date().toISOString().slice(0, 10);
  changed = true;
  console.log(`[down] ${e.name} ← ${url}\n         ${(buf.length / 1024).toFixed(0)} KB  sha256=${e.sha256.slice(0, 16)}…`);
  ok++;
}
if (changed) {
  fs.writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');
  console.log('assets.lock.json 已更新（校验和回写）');
}
console.log(`\n完成：ok=${ok} fail=${bad}`);
process.exit(bad ? 1 : 0);
