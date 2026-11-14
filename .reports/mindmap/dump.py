"""Dump per-category frequency data for the Mindmap writers.
python -I -X utf8 .reports/mindmap/dump.py  ->  .review/mindmap/<cat>.json"""
import json, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parents[2]
qs = {q["id"]: q for q in json.load(open(ROOT / "source/questions.json", encoding="utf-8"))}
tags = json.load(open(ROOT / "source/topics.json", encoding="utf-8"))["tags"]
tx = json.load(open(ROOT / "source/taxonomy.json", encoding="utf-8"))
f = json.load(open(ROOT / "source/facts-th.json", encoding="utf-8"))
cards = f["cards"] if isinstance(f, dict) else f
for cat in tx["categories"]:
    subs = []
    for s in cat["subs"]:
        ids = [int(k) for k, t in tags.items() if t["sub"] == s["id"]]
        cs = sorted([c for c in cards if c["sub"] == s["id"]], key=lambda c: (-sum(2 if x >= 392 else 1 for x in c["sources"]), c["tier"]))
        subs.append({"sub": s["id"], "name": s["name"], "questions": len(ids), "braindump": sum(1 for i in ids if qs[i].get("origin") == "braindumps"),
                     "cards": [{"id": c["id"], "tier": c["tier"], "kind": c["kind"], "asked": len(c["sources"]), "asked_braindump": sum(1 for x in c["sources"] if x >= 392),
                                "cue": c["cue"], "fact": c["fact"], "note": c.get("note", "")} for c in cs]})
    subs.sort(key=lambda s: -(s["questions"] + s["braindump"]))
    out = {"cat": cat["id"], "name": cat["name"], "questions": sum(s["questions"] for s in subs), "subs": subs}
    (ROOT / f".review/mindmap/{cat['id']}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(cat["id"], out["questions"], [(s["sub"], s["questions"], s["braindump"], len(s["cards"])) for s in subs])
