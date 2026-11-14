"""Stage writer batches for braindump Set N (already in source/questions.json via sync_bank.py).

Usage: python -I -X utf8 .reports/answer-check/stage_set.py <N>
Writes .review/setN/batch-{1,2,3}.txt and copies the style examples.
"""
import json, pathlib, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
N = int(sys.argv[1])
bank = {q["id"]: q for q in json.load(open(ROOT / "source/questions.json", encoding="utf-8"))}
ids = sorted(i for i, q in bank.items() if q["set"] == N)
assert ids, f"set {N} not in bank; run sync_bank.py {N} first"

# Notes for questions whose key we changed (VERDICT.md). Debated ones must name the rival answer.
NOTE = {
    558: "DEBATED key (user decision C; site said D). State the rival answer D (RI + On-Demand) and why it's debated: 'without any downtime' can be read as 'avoid Spot', but the RI baseline keeps processing running and SQS work tolerates Spot interruptions, so C is cheaper.",
    913: "DEBATED key (user decision A; site said D). State the rival answer D (Athena Federated Query) and why it's debated: it reads DynamoDB through a connector without touching the app path, but it is an analytics path that consumes read capacity; AppSync pipeline resolvers are the app-facing way to read multiple tables.",
    930: "FLAWED question (user decision C; site said D). Say plainly that no option is fully valid today: RDS Multi-AZ DB clusters don't support Oracle, and D needs an Oracle-to-Aurora migration. C is the intended answer because only a Multi-AZ DB cluster has readable standbys for reporting.",
}
for i, q in bank.items():
    if q.get("siteCorrect") and i not in NOTE:
        NOTE[i] = f"Key corrected by our review (site said {','.join(q['siteCorrect'])}). The EN explanation below was rewritten by us and is reliable. Explain why the site's answer is wrong."

out_dir = ROOT / f".review/set{N}"
out_dir.mkdir(parents=True, exist_ok=True)
(ROOT / f".reports/set{N}").mkdir(parents=True, exist_ok=True)
shutil.copy(ROOT / ".review/set7/examples.txt", out_dir / "examples.txt")
k = (len(ids) + 2) // 3
for n in range(3):
    chunk = ids[n * k:(n + 1) * k]
    parts = []
    for i in chunk:
        q = bank[i]
        s = f"=== Q{i}  (type {q['type']}, KEY: {','.join(q['correct'])})\n"
        if i in NOTE:
            s += f"NOTE: {NOTE[i]}\n"
        s += q["question"] + "\n" + "\n".join(f"{c['letter']}. {c['text']}" for c in q["choices"])
        s += f"\n--- EN explanation (site's, AI-written unless the NOTE says we rewrote it):\n{q['explanation']}\n"
        parts.append(s)
    (out_dir / f"batch-{n + 1}.txt").write_text("\n".join(parts), encoding="utf-8")
    print(n + 1, chunk[0], chunk[-1], "notes:", [i for i in chunk if i in NOTE])
