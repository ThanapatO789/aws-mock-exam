# Review task: new fact cards (Braindump supplement)

You are reviewing new study flash cards for AWS Certified Solutions Architect – Associate (SAA-C03). Each card has a Thai `cue` (front) and `fact` (back), plus `sources`: question ids it was drawn from. A learner will memorise these 9 days before the exam, so a wrong card teaches the wrong thing.

The cards are in the JSON file named in the prompt. Read only that file. Do not run commands and do not modify any files.

## Checkpoints (per card)
1. **Accuracy**: every AWS claim in `fact` is correct as of today (limits, defaults, names, retired or renamed services). Flag anything false, outdated or overstated.
2. **Cue ↔ fact**: the fact actually answers the cue, and the rule is the one the exam tests.
3. **Trap**: if the card names a wrong choice or trap, the reason it gives is valid.
4. **Kind / tier / sub**: `kind` fits (compare, antipattern, number, fact), and the sub-topic is right. Flag only clear mismatches.
5. **Thai**: flag only wording that is confusing or ambiguous.

## Output (markdown)
- `## Errors`: `- <card id>: <what is wrong> → <correct statement>` (quote the Thai).
- `## Weak spots`: lower-priority issues, same format.
- `## Verdict`: one line, how many cards are fine as-is.
