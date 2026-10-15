"""把本地提交原样搬到远端（Git Data API），力求**远端 commit sha 与本地完全一致**。
要点：author/committer/日期/提交信息照抄本地 → sha 可复现；blob 已存在就不再上传；
      tree 条目用 NUL 分隔解析（非 ASCII 路径不会被 git 转义成 \"\\350\\265...\"）。
用法：python tools/push-via-api.py --exact
"""
import base64, json, os, subprocess, sys

REPO = "lujun-dev/web3d-kit"
K = os.environ.get("WEB3D_KIT_DIR") or r"D:\hermes-output\web3d-kit"

def token():
    for gh in (r"C:\Program Files\GitHub CLI\gh.exe", "gh"):
        try:
            r = subprocess.run([gh, "auth", "token"], capture_output=True, text=True, errors="replace")
            if r.returncode == 0 and r.stdout.strip():
                return r.stdout.strip()
        except Exception:
            pass
    raise SystemExit("拿不到 gh token")

TK = token()

def call(method, path, payload=None, allow_404=False):
    args = ["curl", "-sS", "-X", method, "-H", f"Authorization: Bearer {TK}",
            "-H", "Accept: application/vnd.github+json", "-H", "X-GitHub-Api-Version: 2022-11-28",
            f"https://api.github.com{path}"]
    inp = None
    if payload is not None:
        args += ["-H", "Content-Type: application/json", "--data-binary", "@-"]
        inp = json.dumps(payload).encode("utf-8")
    r = subprocess.run(args, input=inp, capture_output=True)
    try:
        j = json.loads(r.stdout.decode("utf-8", "replace"))
    except Exception:
        raise SystemExit(f"{method} {path} 非 JSON: {r.stdout[:200]!r}")
    if isinstance(j, dict) and j.get("message") and "sha" not in j:
        if allow_404 and "Not Found" in str(j.get("message")):
            return None
        raise SystemExit(f"{method} {path} 报错: {j.get('message')}")
    return j

def git(*a, nul=False):
    r = subprocess.run(["git", *a], cwd=K, capture_output=True)
    return r.stdout if nul else r.stdout.decode("utf-8", "replace")

def git1(*a):
    return git(*a).strip()

base = call("GET", f"/repos/{REPO}/git/ref/heads/main")["object"]["sha"]
head = git1("rev-parse", "HEAD")
want = [c for c in git("rev-list", "--reverse", f"{base}..{head}").split() if c]
print(f"远端 {base[:8]} → 本地 {head[:8]}，待搬 {len(want)} 个提交")

prev, up, miss = base, None, 0
for c in want:
    meta = git("log", "-1", "--format=%an%n%ae%n%aI%n%cn%n%ce%n%cI%n%B", c).split("\n")
    an, ae, ad, cn, ce, cd = meta[0], meta[1], meta[2], meta[3], meta[4], meta[5]
    msg = "\n".join(meta[6:]).strip() + "\n"
    parent = git1("rev-parse", f"{c}^")
    raw = git("diff", "--name-status", "-z", "--no-renames", parent, c, nul=True).decode("utf-8", "replace")
    parts = [p for p in raw.split("\0") if p]
    entries, i = [], 0
    while i < len(parts):
        st, path = parts[i], parts[i + 1]
        i += 2
        if st == "D":
            entries.append({"path": path, "mode": "100644", "type": "blob", "sha": None}); continue
        bsha = git1("rev-parse", f"{c}:{path}")
        if call("GET", f"/repos/{REPO}/git/blobs/{bsha}", allow_404=True) is None:
            data = git("show", f"{c}:{path}", nul=True)
            bsha = call("POST", f"/repos/{REPO}/git/blobs",
                        {"content": base64.b64encode(data).decode("ascii"), "encoding": "base64"})["sha"]
            miss += 1
        entries.append({"path": path, "mode": "100644", "type": "blob", "sha": bsha})
    p_tree = (call("GET", f"/repos/{REPO}/git/commits/{prev}")["tree"]["sha"])
    tree = call("POST", f"/repos/{REPO}/git/trees", {"base_tree": p_tree, "tree": entries})
    if tree["sha"] != git1("rev-parse", f"{c}^{{tree}}"):
        print(f"  ! tree 不一致 {c[:8]}：远端 {tree['sha'][:8]} vs 本地 {git1('rev-parse', c + '^{tree}')[:8]}")
    rec = call("POST", f"/repos/{REPO}/git/commits",
               {"message": msg, "tree": tree["sha"], "parents": [prev],
                "author": {"name": an, "email": ae, "date": ad},
                "committer": {"name": cn, "email": ce, "date": cd}})
    flag = "sha 一致 ✓" if rec["sha"] == c else f"sha 不同（远端 {rec['sha'][:8]}）"
    print(f"  {c[:8]} → {rec['sha'][:8]}  {flag}  {msg.splitlines()[0][:36]}")
    prev = rec["sha"]

print("补传 blob:", miss)
call("PATCH", f"/repos/{REPO}/git/refs/heads/main", {"sha": prev, "force": True})
print("远端 main =", prev)
if prev == head:
    print("远端与本地 sha 完全一致 ✓（本地 refs 无需改动）")
else:
    subprocess.run(["git", "fetch", "--depth", "1", "origin"], cwd=K, capture_output=True)
