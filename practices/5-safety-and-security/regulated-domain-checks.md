---
id: regulated-domain-checks
title: Regulated-domain checks
area: 5-safety-and-security
status: draft
last_reviewed: 2026-09-26
sources: [S098, S119, S121, S124, S127, S133, S134]
related: [guardrails, false-positive-protection, redaction-in-telemetry, exploratory-testing-of-agents]
---

# Regulated-domain checks

## What
Some behaviours are fixed by law or regulation rather than by product judgement. In US messaging, the
words a consumer may use to revoke consent, the time allowed to honour it and the content of the one
confirmation text are set by the FCC [S133]. In US healthcare, systems that hold electronic protected
health information must "record and examine activity" under the HIPAA Security Rule's audit-controls
standard [S134]. A regulated-domain check is a test whose expected result is the rule, verbatim, and
whose coverage is every state the conversation can be in.

## Why
A model-level safety evaluation does not reach these failures. The failure is usually architectural:
a state of the conversation machine where the keyword handler does not run, a scheduler that keeps
sending, a log that keeps clear text. The consequence is exposure under a statute, not a bad answer.
The trade-off is coverage: testing every state against every keyword is a matrix, and it grows with
every new hand-off path. It is still cheaper than the alternative.

## How
1. Enumerate the verbatim rules. For SMS opt-out the FCC order says using "the words 'stop,' 'quit,'
   'end,' 'revoke,' 'opt out,' 'cancel,' or 'unsubscribe' via reply text message constitutes a per se
   reasonable means to revoke consent", that other words and phrases are not precluded, that requests
   are honoured "within a reasonable time" and "not to exceed 10 business days", and that one
   confirmation text is allowed only if it "does not include any marketing or promotional information"
   and is "the only additional message sent" [S133].
2. Enumerate the states. Include the ones that feel terminal but are not: handed to a human coach,
   waiting on a survey, paused, language-switched, session dead-ended. A hold state is still a state.
3. Build the matrix: state times keyword times language. Each cell asserts four things: the keyword is
   intercepted (not forwarded as an ordinary message), the scheduler is suppressed, exactly one
   confirmation goes out with no marketing, and the record shows the revocation with a timestamp.
4. Explore the machine, not just the happy path. Walk the hand-off states by hand and send the keyword
   from each. Structured exploration finds the state the diagram forgot.
5. Test PII and PHI handling as its own suite. Bedrock sensitive-information filters can mask or block
   named entity types and custom regex [S124]; write cases for what must be masked and what must not
   (a name and an age may be required to work). Then check the logs: Bedrock warns that blocked content
   "will appear as plain text" in invocation logs if logging is on [S124].
6. Check the audit trail against the rule. Audit controls require mechanisms that "record and examine
   activity in information systems that contain or use electronic protected health information" [S134].
   Your trace pipeline is such a system; decide what it records and who examines it.
7. File one finding for one cause. When three symptoms share a root (a hold state treated as terminal,
   a scheduler not suppressed, a keyword not intercepted), one architectural finding gets fixed once.
   Three bug tickets get fixed three times, or once each.
8. Add domain safety evaluations that mirror the labs' shape. Anthropic reports child safety, "suicide
   and self-harm" and "disordered eating" evaluations as standing suites [S098]; AILuminate lists
   "specialized advice (election, financial, health, legal)" as a hazard category [S119]. A health
   product needs its own versions with verbatim canned copy as the expected output.

## Who does it (sourced)
- **FCC, February 2024:** the Commission "codify a new rule that will make clear that consumers may
  revoke prior express consent ... in any reasonable manner", lists the seven per se reasonable words,
  sets the 10-business-day limit, and codifies the one-time confirmation text [S133].
- **HHS, 45 CFR 164.312(b):** the audit-controls standard requires "hardware, software, and/or
  procedural mechanisms that record and examine activity in information systems that contain or use
  electronic protected health information" [S134].
- **NIST, July 2024:** AI 600-1 lists Data Privacy among its twelve generative-AI risks, described as
  "impacts due to leakage and unauthorized use, disclosure, or de-anonymization" of information, and
  suggests red-teaming for outputting of training data and personal information [S127].
- **OWASP, living:** the Top 10 lists LLM02 Sensitive Information Disclosure and LLM06 Excessive
  Agency, the latter describing a system "granted a degree of agency" beyond what the task needs [S121].
- **Anthropic, September 2026:** the Opus 5.5 card reports evaluations for child safety, suicide and
  self-harm, disordered eating, political even-handedness and election integrity as part of its
  standard safeguards testing [S098].
- **MLCommons, February 2025:** AILuminate v1.0 grades systems across 12 hazard categories including
  privacy and specialised advice, on a five-tier scale from Poor to Excellent [S119].
- **AWS, living:** Bedrock Guardrails sensitive-information filters detect PII "in standard formats or
  custom regex entities" and can block or mask them in inputs and responses [S124].

## Pitfalls
1. A hold state treated as terminal. The scheduler keeps sending and the keyword handler never runs.
2. The keyword forwarded as content. When a person is routed to a human, STOP must still be
   intercepted before the router; the order does not care who was meant to read it [S133].
3. A confirmation text with a nudge in it. One message, no marketing, or it is not the permitted
   confirmation [S133].
4. PHI in the guardrail's own logs [S124]. The filter that blocked it can be the system that leaked it.
5. Three tickets for one cause. The fix lands in one place; file it that way.

## Pattern from a production build
None yet.

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S119] AILuminate v1.0 benchmark paper, MLCommons, 2025-02-19.
- [S121] OWASP Top 10 for LLM Applications, OWASP GenAI Security Project, living.
- [S124] Amazon Bedrock Guardrails components, AWS, living.
- [S127] NIST AI 600-1 Generative AI Profile, NIST, 2024-07-26.
- [S133] TCPA Rules Revoking Consent for Unwanted Robocalls and Robotexts (FCC 24-24), FCC, 2024-02-16.
- [S134] Summary of the HIPAA Security Rule (45 CFR 164.312 audit controls), HHS, living.
