"""Apply review fixes: python -I -X utf8 .reports/mindmap/patch.py <cat> <fixes.json>
fixes.json = [{"find": "substring of t (or of a cheat 's'/'a', or flow 'r')", "t"?, "d"?, ...}] — every find must hit exactly once."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
cat, fx = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
p = ROOT / f".reports/mindmap/{cat}.json"
d = json.load(open(p, encoding="utf-8"))
hits = {i: 0 for i in range(len(fx))}
def apply(obj, keys):
    for i, f in enumerate(fx):
        if any(f["find"] in str(obj.get(k, "")) for k in keys):
            hits[i] += 1
            for k, v in f.items():
                if k != "find": obj[k] = v
def walk(n):
    apply(n, ["t"])
    for c in n.get("c", []): walk(c)
def walkflow(f):
    apply(f, ["q"])
    for o in f["opts"]:
        apply(o, ["r", "a"]) if not o.get("to") else None
        if o.get("to"): walkflow(o["to"])
for r in d.get("cheat", []): apply(r, ["s", "a"])
for s in d["subs"]:
    for x in s.get("flows", []): walkflow(x["flow"])
    for n in s["points"]: walk(n)
bad = {fx[i]["find"]: h for i, h in hits.items() if h != 1}
assert not bad, bad
json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("patched", len(fx))
