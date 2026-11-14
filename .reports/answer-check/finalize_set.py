"""Validate / stage review / merge the Thai content for braindump Set N.

  python -I -X utf8 .reports/answer-check/finalize_set.py review <N>
      merges .reports/setN/batch-*.json -> setN-merged.json, validates it,
      writes .review/setN/review-{1,2,3}.txt for agy
  python -I -X utf8 .reports/answer-check/finalize_set.py merge <N>
      re-validates setN-merged.json (edit it to apply review fixes first), then
      adds it to explanations-th / analysis-th / topics and enables Set N in
      index.html (both dropdowns + Random max) and the README counts.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
cmd, N = sys.argv[1], int(sys.argv[2])
R = ROOT / f".reports/set{N}"
bank = {q["id"]: q for q in json.load(open(ROOT / "source/questions.json", encoding="utf-8"))}
ids = sorted(i for i, q in bank.items() if q["set"] == N)
tx = json.load(open(ROOT / "source/taxonomy.json", encoding="utf-8"))
SUBS = {s["id"]: c["id"] for c in tx["categories"] for s in c["subs"]}
PILL = {p["name"] for p in tx["pillars"]}


def validate(M):
    bad = []
    if sorted(map(int, M)) != ids:
        bad.append(("ids", sorted(set(ids) ^ set(map(int, M)))))
    for k, v in M.items():
        q, t = bank[int(k)], v["tag"]
        if SUBS.get(t["sub"]) != t["cat"] or t["pillar"] not in PILL or t["domain"] not in ("secure", "resilient", "performant", "cost"):
            bad.append((k, "tag", t))
        bad += [(k, "phrase", p) for p in v["analysis"]["phrases"] if p not in q["question"]]
        if re.search(r"(ตัวเลือก|ข้อ|option)\s*[A-F]\b", v["th"]):
            bad.append((k, "letter"))
        if "**จุดจำ" not in v["th"] or "ตัวเลือกที่ถูก" not in v["th"]:
            bad.append((k, "structure"))
    return bad


if cmd == "review":
    M, doubts = {}, {}
    for f in sorted(R.glob("batch-*.json")):
        d = json.load(open(f, encoding="utf-8"))
        doubts.update(d.pop("_doubts", {}) or {})
        M.update(d)
    bad = validate(M)
    print("problems:", bad)
    print("doubts:", doubts)
    json.dump(M, open(R / f"set{N}-merged.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    out = []
    for k in sorted(M, key=int):
        q, v = bank[int(k)], M[k]
        note = f"(key corrected by our review; site said {','.join(q['siteCorrect'])})\n" if q.get("siteCorrect") else ""
        out.append(f"=== Q{k}  KEY: {','.join(q['correct'])}\n{note}{q['question']}\n"
                   + "\n".join(f"{c['letter']}. {c['text']}" for c in q["choices"])
                   + f"\n--- TH:\n{v['th']}\n--- ANALYSIS: {json.dumps(v['analysis'], ensure_ascii=False)}\n--- TAG: {json.dumps(v['tag'], ensure_ascii=False)}\n")
    k = (len(out) + 2) // 3
    for n in range(3):
        (ROOT / f".review/set{N}/review-{n + 1}.txt").write_text("\n".join(out[n * k:(n + 1) * k]), encoding="utf-8")

elif cmd == "merge":
    M = json.load(open(R / f"set{N}-merged.json", encoding="utf-8"))
    bad = validate(M)
    assert not bad, bad
    for path, key, fn in [("source/explanations-th.json", "explanations", lambda v: v["th"]),
                          ("source/analysis-th.json", "analysis", lambda v: v["analysis"]),
                          ("source/topics.json", "tags", lambda v: v["tag"])]:
        d = json.load(open(ROOT / path, encoding="utf-8"))
        for k, v in M.items():
            assert k not in d[key], (path, k)
            d[key][k] = fn(v)
        if key == "analysis":
            d["_comment"] = re.sub(r"Set 7-?\d* \(ids 392-\d+,", f"Set 7-{N} (ids 392-{ids[-1]},", d["_comment"])
        (ROOT / path).write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    p = ROOT / "index.html"
    s = p.read_text(encoding="utf-8")
    label = f"Set {N} · Braindump" + (f" ({len(ids)} ข้อ)" if len(ids) != 65 else "")
    s, n = re.subn(rf'(?m)^( +)<option value="{N - 1}">Set {N - 1} · Braindump[^<]*</option>\n',
                   lambda m: m[0] + f'{m[1]}<option value="{N}">{label}</option>\n', s)
    assert n == 2, "dropdown anchor not found"
    s = re.sub(r'max="\d+" value="65"', f'max="{ids[-1]}" value="65"', s)
    p.write_text(s, encoding="utf-8")
    p = ROOT / "README.md"
    s = p.read_text(encoding="utf-8")
    s = re.sub(r"question bank: \d+ questions in \d+ sets\.", f"question bank: {ids[-1]} questions in {N} sets.", s)
    s = re.sub(r"Sets 7–\d+ \(ids 392–\d+\) are", f"Sets 7–{N} (ids 392–{ids[-1]}) are", s)
    staged = 940 - ids[-1]
    s = re.sub(r"\d+ more are staged in\n`questions-fixed.json` as Sets \d+–15",
               f"{staged} more are staged in\n`questions-fixed.json` as Sets {N + 1}–15", s) if N < 15 else s
    s = re.sub(r"choose an exam set \(1–\d+\)", f"choose an exam set (1–{N})", s)
    s = re.sub(r"custom count \(1–\d+, default 65\)", f"custom count (1–{ids[-1]}, default 65)", s)
    p.write_text(s, encoding="utf-8")
    print(f"merged set {N}: {len(M)} entries; UI enabled up to id {ids[-1]}")
