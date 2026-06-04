"""Parse the Arise Lead Engineer Assessment PDF into questions.json.

Each question block:
    Question N
    Question: ...
    Choices:
    A. ...
    B. ... ✓
    ...
    Explanation: ...

Multi-correct questions have multiple lines ending with ✓.
"""

import json
import re
from pathlib import Path

from pypdf import PdfReader

HERE = Path(__file__).parent
PDF = HERE / "Exam_Arise_Assessment_Lead_Q1_Q136.pdf"
OUT = HERE / "questions.json"


def extract_text() -> str:
    reader = PdfReader(str(PDF))
    return "\n".join(p.extract_text() for p in reader.pages)


def parse(text: str) -> list[dict]:
    # Split on "Question N" where N is a number on its own (the section header,
    # not the "Question:" prompt that comes right after).
    parts = re.split(r"\n\s*Question\s+(\d+)\s*\n", text)
    # parts = [preamble, "1", body1, "2", body2, ...]
    questions = []
    for i in range(1, len(parts), 2):
        qno = int(parts[i])
        body = parts[i + 1]
        q = parse_block(qno, body)
        if q:
            questions.append(q)
    return questions


CHOICE_RE = re.compile(r"^\s*([A-Z])\.\s+(.*)$")


ORDER_LINE_RE = re.compile(r"^\s*\d+\.\s*([A-Z])\.\s+.*$")


def parse_block(qno: int, body: str) -> dict | None:
    # body begins with "Question: ..." then "Choices:" then choice lines,
    # optionally a "Correct order:" section (ordering questions),
    # then "Explanation: ..."
    m_q = re.search(r"Question:\s*(.+?)\n\s*Choices:\s*\n", body, re.DOTALL)
    if not m_q:
        return None
    prompt = clean(m_q.group(1))
    rest = body[m_q.end():]

    m_e = re.search(r"\n\s*Explanation:\s*(.+?)(?=$|\n\s*Question\s+\d+\s*\n)", rest, re.DOTALL)
    if m_e:
        body_text = rest[: m_e.start()]
        explanation = clean(m_e.group(1))
    else:
        body_text = rest
        explanation = ""

    # Detect ordering format: split out the "Correct order:" section if present.
    m_order = re.search(r"\n\s*Correct order:\s*\n", body_text)
    if m_order:
        choices_text = body_text[: m_order.start()]
        order_text = body_text[m_order.end():]
    else:
        choices_text = body_text
        order_text = ""

    choices = []
    current = None
    for raw_line in choices_text.splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            continue
        m = CHOICE_RE.match(line)
        if m:
            if current:
                choices.append(current)
            letter = m.group(1)
            content = m.group(2)
            correct = "✓" in content
            content = content.replace("✓", "").strip()
            current = {"letter": letter, "text": content, "correct": correct}
        else:
            if current is not None:
                extra = line.strip().replace("✓", "")
                if "✓" in line:
                    current["correct"] = True
                current["text"] = (current["text"] + " " + extra).strip()
    if current:
        choices.append(current)

    if order_text.strip():
        # Ordering question: parse "1. X. ...", "2. Y. ..." into a sequence.
        sequence = []
        for raw_line in order_text.splitlines():
            line = raw_line.rstrip()
            m = ORDER_LINE_RE.match(line)
            if m:
                sequence.append(m.group(1))
        return {
            "id": qno,
            "type": "ordering",
            "question": prompt,
            "choices": [{"letter": c["letter"], "text": c["text"]} for c in choices],
            "correct": sequence,
            "explanation": explanation,
            "multi": False,
        }

    return {
        "id": qno,
        "type": "multi" if sum(1 for c in choices if c["correct"]) > 1 else "single",
        "question": prompt,
        "choices": [{"letter": c["letter"], "text": c["text"]} for c in choices],
        "correct": [c["letter"] for c in choices if c["correct"]],
        "explanation": explanation,
        "multi": sum(1 for c in choices if c["correct"]) > 1,
    }


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


# PDF rendering quirks dropped the ✓ marker for these questions.
# Answers inferred from the printed Explanation text.
OVERRIDES: dict[int, list[str]] = {
    22: ["J"],
}


def main():
    text = extract_text()
    qs = parse(text)
    for q in qs:
        if q["id"] in OVERRIDES:
            q["correct"] = OVERRIDES[q["id"]]
            q["multi"] = len(q["correct"]) > 1
    print(f"Parsed {len(qs)} questions")
    bad = [q["id"] for q in qs if not q["correct"]]
    if bad:
        print(f"WARN: questions with no correct answer: {bad}")
    OUT.write_text(json.dumps(qs, ensure_ascii=False, indent=2))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
