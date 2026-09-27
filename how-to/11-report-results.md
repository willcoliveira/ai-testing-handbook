---
id: report-results
title: Report results
sources: [S004, S006, S052]
last_reviewed: 2026-09-26
---

# Report results

## When
Every time a number leaves the team: a pull request comment, a release note, a stakeholder
update, an audit, an interview.

## What
A report where every number has a provenance, every claim has evidence and a trade-off, the
distribution is shown rather than a single run, and the not-covered list is present.

## Why
A pass rate without its sample size, interval, judge and date is a rumour. Error bars are
computable and readers act differently when they see them [S004]. Selective reporting is the
mechanism behind inflated leaderboards [S006], and the same mechanism operates inside a team
that reports its best run. Binary criteria and counted verdicts make the report checkable [S052].

## How
1. **Lead with the decision or the finding,** one sentence. Then the evidence. Then the
   trade-off accepted.
2. **Give every number a provenance column:** which run, which case set version, which judge,
   which date. If you cannot write the provenance in one clause, do not quote the number.
3. **Show the distribution.** N runs, mean, interval; paired differences for comparisons.
   Never the best run.
4. **Report the miss.** If the median passed and the tail did not, say both. Rounding the tail
   away is the report's most common lie.
5. **Count unable-to-verify** and skipped cases separately and say what they mean.
6. **Separate substantive findings from wording drift.** Wording goes to content owners;
   state corruption, safety and verbatim compliance breaks go to engineering.
7. **Rank findings by severity with evidence:** a quoted line, an id, a turn or timestamp,
   even for passes.
8. **End with what is not covered.** A short list. It is the section a good reader turns to first.
9. **Keep the whole thing to one page** where a decision is being made. Attach the rest.

One-page template:

```
Decision or finding (one sentence)
Evidence (the table: metric | value | N | interval | provenance)
Trade-off accepted (one or two sentences)
Misses and unable-to-verify (counts and what they mean)
Findings (ranked, each: severity, evidence line, owner, playbook)
Not covered (list)
Versions: cases, model, prompt, judge, tools, date
```

## Done when
Every number has a provenance clause; N and intervals are present; the miss is stated; findings
carry evidence; the not-covered list exists; a reader who did not watch the work can reproduce
the claim from the versions line.

## Related
Practices: [statistical-treatment-of-evals](../practices/1-capability/statistical-treatment-of-evals.md),
[human-annotation](../practices/3-judging/human-annotation.md).
