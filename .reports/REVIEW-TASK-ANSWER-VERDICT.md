# Review task: challenge the answer-key verdicts (SAA-C03 braindump set)

A braindump answer key was checked by two blind solvers. A third reviewer (Claude) then proposed final verdicts: change the key for some questions (sections A and B), keep it for others (section C), and confirm the policy-exhibit questions (section D). Your job is to **attack those verdicts**. Find any where the proposed final answer is not what AWS would grade as correct on the SAA-C03 exam today.

Everything is in `.review/answers/verdict-review.txt`: the proposed verdicts first, then each question with the site key, both blind answers, any policy exhibit (now transcribed), and the choices. Read only that file. Do not run commands and do not modify any files.

## Checkpoints
1. For every question listed, decide the correct answer yourself, reading the qualifiers (LEAST overhead, MOST cost-effective, durably, etc.).
2. Section B (debated changes) and Q540 matter most. For each, say whether you **agree** with the proposed change, or whether the original site key should stand.
3. Check the factual claims in the verdict reasons (e.g. Q419 "Organizations has no default-EBS-encryption setting", Q394 "RDS gp3 can raise IOPS up to 64,000 in place", Q239 "Lambda function URL supports AWS_IAM auth"). Flag any that are false.
4. For the policy questions (96, 253, 423, 429, 494), evaluate the exhibit and confirm or reject the key.

## Output (markdown)
- `## Disagree`: one entry per question where the proposed final answer is wrong: `- Q<id>: proposed X → should be Y, because …`
- `## Agree but reason is wrong`: the answer is right but the stated reason is false or misleading.
- `## Verdict`: one line, e.g. "Agree with N of 31".

Be terse. Don't list questions you fully agree with.
