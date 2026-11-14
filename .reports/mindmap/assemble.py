"""Assemble .reports/mindmap/<cat>.json -> source/summary-th.json, validating each.
python -I -X utf8 .reports/mindmap/assemble.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
tx = json.load(open(ROOT / "source/taxonomy.json", encoding="utf-8"))
f = json.load(open(ROOT / "source/facts-th.json", encoding="utf-8"))
cards = {c["id"]: c for c in (f["cards"] if isinstance(f, dict) else f)}
out = {"_comment": "Summary page: per category, what the exam asks most. Built by .reports/mindmap/assemble.py from writer output; leaves cite fact-card ids in src, the app counts questions from them.", "categories": {}}
for cat in tx["categories"]:
    p = ROOT / f".reports/mindmap/{cat['id']}.json"
    if not p.exists():
        continue
    d = json.load(open(p, encoding="utf-8"))
    subs = [s["id"] for s in cat["subs"]]
    assert sorted(s["sub"] for s in d["subs"]) == sorted(subs), (cat["id"], "subs")
    def walk(n, path):
        assert n.get("t"), path
        assert n.get("k") in (None, "tip", "num", "trap", "vs"), (path, n.get("k"))
        for i in n.get("src", []):
            assert i in cards and cards[i]["cat"] == cat["id"] or i in cards, (path, i)
        if not n.get("c"):
            assert n.get("src"), (path, "leaf without src", n["t"])
        for ch in n.get("c", []):
            walk(ch, path + " > " + ch["t"])
    for r in d.get("cheat", []):
        assert r.get("s") and r.get("a"), (cat["id"], "cheat row", r)
    def flow(f, path):
        assert f.get("q") and f.get("opts"), (path, "flow needs q + opts")
        for o in f["opts"]:
            assert o.get("a") and (bool(o.get("r")) != bool(o.get("to"))), (path, "option needs a + exactly one of r/to", o)
            if o.get("to"):
                flow(o["to"], path + " > " + o["a"])
    for s in d["subs"]:
        for x in s.get("flows", []):
            assert x.get("title"), (s["sub"], "flow title")
            flow(x["flow"], s["sub"] + ": " + x["title"])
        for n in s["points"]:
            walk(n, s["sub"] + ": " + n["t"])
    out["categories"][cat["id"]] = d
    print("ok", cat["id"], [(s["sub"], len(s["points"])) for s in d["subs"]])
(ROOT / "source/summary-th.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
