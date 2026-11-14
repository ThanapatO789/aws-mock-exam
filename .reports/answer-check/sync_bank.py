"""Put braindump Sets 7..N into source/questions.json (ids stay stable).

Set k (k >= 7) = questions-fixed.json[(k-7)*65 : (k-6)*65], ids 392 + index.
Usage: python -I -X utf8 .reports/answer-check/sync_bank.py <last set, 7..15>
Re-running replaces every braindump entry, so text fixes made via apply_fixes.py
flow through. Thai content lives in the other source/*.json files keyed by id.
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
last = int(sys.argv[1])
assert 7 <= last <= 15
bank = [q for q in json.load(open(ROOT / "source/questions.json", encoding="utf-8")) if q.get("origin") != "braindumps"]
assert max(q["id"] for q in bank) == 391
fixed = json.load(open(ROOT / "source/other/braindumps/questions-fixed.json", encoding="utf-8"))
for i, q in enumerate(fixed):
    s = 7 + i // 65
    if s > last:
        break
    e = {"id": 392 + i, "set": s, "type": q["type"], "question": q["question"], "choices": q["choices"],
         "correct": q["correct"], "explanation": q["explanation"], "multi": q["multi"],
         "origin": "braindumps", "srcId": q["id"]}
    if "siteCorrect" in q:
        e["siteCorrect"] = q["siteCorrect"]
    if q.get("flawed"):
        e["flawed"] = True
    bank.append(e)
(ROOT / "source/questions.json").write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"bank: {len(bank)} questions, sets 1..{last}, last id {bank[-1]['id']}")
