"""Three-way answer check: site key vs Claude (blind) vs agy (blind).

Usage: python -I .reports/answer-check/compare.py
Writes .reports/answer-check/disagreements.md and summary.json.
"""
import json, re, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parents[2]
D = ROOT / ".reports" / "answer-check"
bank = json.load(open(ROOT / "source/other/braindumps/questions.json", encoding="utf-8"))

LINE = re.compile(r"^\s*\**Q(\d+)\**\s*\|\s*([A-F](?:\s*,\s*[A-F])*)\s*\|\s*(high|med|low)\s*\|?\s*(.*)$", re.I)

def load(prefix):
    out = {}
    for f in sorted(D.glob(f"{prefix}-*.md")):
        for line in f.read_text(encoding="utf-8", errors="replace").splitlines():
            m = LINE.match(line.strip().strip("`"))
            if m:
                out[int(m[1])] = {
                    "ans": sorted(x.strip().upper() for x in m[2].split(",")),
                    "conf": m[3].lower(),
                    "note": m[4].strip(),
                }
    return out

claude, agy = load("claude"), load("agy")
rows, stats = [], collections.Counter()
for q in bank:
    i, key = q["id"], sorted(q["correct"])
    c, a = claude.get(i), agy.get(i)
    ca = c and c["ans"] == key
    aa = a and a["ans"] == key
    if c is None: stats["claude_missing"] += 1
    if a is None: stats["agy_missing"] += 1
    if ca and aa:
        stats["all_agree"] += 1
        continue
    if c and a and c["ans"] == a["ans"] and not ca:
        bucket = "both_disagree_with_key"        # strongest signal the key is wrong
    elif not ca and not aa and c and a:
        bucket = "three_way_split"
    else:
        bucket = "one_disagrees"
    stats[bucket] += 1
    rows.append((bucket, q, key, c, a))

order = {"both_disagree_with_key": 0, "three_way_split": 1, "one_disagrees": 2}
rows.sort(key=lambda r: (order[r[0]], r[1]["id"]))

def fmt(x):
    if not x: return "—"
    return f"{','.join(x['ans'])} ({x['conf']}){' — ' + x['note'] if x['note'] else ''}"

md = ["# Answer-key disagreements", "", "```", json.dumps(dict(stats), indent=1), "```", ""]
cur = None
for bucket, q, key, c, a in rows:
    if bucket != cur:
        md += ["", f"## {bucket} ", ""]
        cur = bucket
    md.append(f"- **Q{q['id']}** key={','.join(key)} | claude={fmt(c)} | agy={fmt(a)}")
(D / "disagreements.md").write_text("\n".join(md) + "\n", encoding="utf-8")
json.dump({"stats": stats, "ids": {b: [r[1]["id"] for r in rows if r[0] == b] for b in order}},
          open(D / "summary.json", "w", encoding="utf-8"), indent=1)
print(json.dumps(dict(stats), indent=1))
