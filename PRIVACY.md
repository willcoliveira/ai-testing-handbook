# Privacy rules

This repository is public. Everything in it must be publishable without a second look.

## The rule

No client name, agency name, vendor under evaluation or NDA, ticket id, hostname, cloud account
id, internal product name, employee name, or production finding tied to a named organisation.
Not in prose, not in file names, not in commit messages, not in digests.

## Anonymisation vocabulary

Every pattern file uses the same stand-ins, so nothing can be triangulated across files.

| Instead of | Write |
|---|---|
| the healthcare client and its programme | "a regulated healthcare programme" |
| the voice enrolment product | "an inbound voice enrolment agent on Twilio ConversationRelay with Bedrock models" |
| the SMS coaching product | "SMS coaching agents behind a TypeScript hub and a Python agent service" |
| the agent-to-agent testing vendor | "a commercial agent-to-agent voice testing platform" |
| the member platform | "the member platform" |
| the contact-centre platform | "the contact-centre platform" |
| the crypto wallet client | "a multi-chain wallet" |
| the ticketing client | "a payments-heavy checkout platform" |
| any engineer | "an engineer", "the AI engineer", "the team" |
| any ticket | "the ticket" |

Infrastructure vendors that do not identify a client (Twilio, AWS Bedrock, Deepgram, ElevenLabs,
Pinecone, NATS, Langfuse, Datadog, ArgoCD, k6, Playwright) may be named.

## Numbers

Scale, method and outcome may be stated (suite sizes, pass rates, latencies, counts). Dates at
month and year granularity at most. No figure that identifies a client's volume or revenue.

## The mechanism

`privacy/forbidden-strings.example.txt` is committed and carries placeholders plus generic
patterns (ticket ids, twelve-digit account ids, ARNs, internal hostnames, emails).
`privacy/forbidden-strings.txt` is gitignored and holds the real names. `scripts/check-forbidden.mjs`
reads both locally and only the example in CI, scans every tracked file plus `digests/`, and exits
non-zero on any hit. It refuses to run if the real list is ever tracked.

## Checklist before a pattern is marked `anonymisation: reviewed`

1. Read the file top to bottom looking only for names, ids and hosts.
2. Every stand-in is from the table above.
3. No number identifies a client.
4. `node scripts/check-forbidden.mjs` passes with the real list present.
5. A public name that a generic pattern flags (a benchmark like MATH-500) goes in `privacy/allowlist.txt`, exact token only.
6. Set `anonymisation: reviewed` in the frontmatter. `check-sources.mjs` refuses to pass a
   `pending` pattern without `--allow-pending`.
