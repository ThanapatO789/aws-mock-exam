"""Write .review/mindmap/<cat>-outline.txt + <cat>-REVIEW.md for an agy fact check.
python -I -X utf8 .reports/mindmap/outline.py <cat>"""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
cat = sys.argv[1]
d = json.load(open(ROOT / f".reports/mindmap/{cat}.json", encoding="utf-8"))
out = [d.get("intro", ""), "", "CHEAT SHEET:"] + [f"- {r['s']} => {r['a']}" + (f" | NOT: {r['not']}" if r.get("not") else "") for r in d.get("cheat", [])]
def fl(f, ind):
    out.append("  " * ind + "? " + f["q"])
    for o in f["opts"]:
        if o.get("r"): out.append("  " * ind + "  - " + o["a"] + " -> " + o["r"])
        else: out.append("  " * ind + "  - " + o["a"] + ":"); fl(o["to"], ind + 2)
def w(n, ind):
    out.append("  " * ind + ("[" + n["k"] + "] " if n.get("k") else "") + n["t"] + (" :: " + n["d"] if n.get("d") else ""))
    if n.get("table"):
        out.append("  " * ind + "  | " + " | ".join(n["table"]["head"]))
        for r in n["table"]["rows"]: out.append("  " * ind + "  | " + " | ".join(r))
    for c in n.get("c", []): w(c, ind + 1)
for s in d["subs"]:
    out.append("\n## " + s["sub"])
    for x in s.get("flows", []): out.append("FLOW: " + x["title"]); fl(x["flow"], 1)
    for n in s["points"]: w(n, 1)
(ROOT / f".review/mindmap/{cat}-outline.txt").write_text("\n".join(out), encoding="utf-8")
(ROOT / f".review/mindmap/{cat}-REVIEW.md").write_text(f"""Review `.review/mindmap/{cat}-outline.txt`: a Thai study summary for the AWS SAA-C03 exam, category {cat}.
It has a cheat sheet (situation => answer, NOT = common wrong pick), decision flows (? question, - option -> result) and points tagged [tip] = deciding rule, [num] = number to memorise, [trap] = wrong answer the exam baits, [vs] = comparison.
Check every claim for factual accuracy as of today (late 2026): numbers, limits, service capabilities, retired or renamed services, and whether each flow leads to the right service.
Also flag any rule that would lead a learner to a wrong exam answer.
Do NOT comment on style, structure or Thai wording. Output a markdown list with one bullet per problem: quote the line, say what is wrong and give the correct fact. If there are no problems, write "NO ISSUES".
""", encoding="utf-8")
print("staged", cat, len(out), "lines")
